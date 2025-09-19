'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ReviewCardProps {
  id: string;
  title: string;
  body: string;
  rating: number;
  animeTitle: string;
  authorName: string;
  createdAt: Date;
  posterUrl?: string;
  _count?: {
    likes: number;
    dislikes: number;
    comments: number;
  };
}

export default function ReviewCard({
  id,
  title,
  body,
  rating,
  animeTitle,
  authorName,
  createdAt,
  posterUrl,
  _count,
}: ReviewCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const handleCardClick = () => {
    router.push(`/review/${id}`);
  };

  // Проверяем статус избранного при загрузке компонента
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        const response = await fetch(`/api/favorite-reviews/check?reviewId=${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setIsFavorite(data.isFavorite);
        }
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };

    checkFavoriteStatus();
  }, [id]);

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLoading) return;

    try {
      setIsLoading(true);
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        alert('Необходимо войти в систему');
        return;
      }

      if (isFavorite) {
        // Удаляем из избранного
        const response = await fetch(`/api/favorite-reviews?reviewId=${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          setIsFavorite(false);
        } else {
          alert('Ошибка при удалении из избранного');
        }
      } else {
        // Добавляем в избранное
        const response = await fetch('/api/favorite-reviews', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ reviewId: id })
        });

        if (response.ok) {
          setIsFavorite(true);
        } else {
          const errorData = await response.json();
          alert(errorData.error || 'Ошибка при добавлении в избранное');
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Ошибка сети');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="bg-white border border-pink-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Poster */}
      {posterUrl && (
        <div className="w-full h-40 md:h-48 bg-pink-50 relative overflow-hidden">
          {!imageError ? (
            <Image 
              src={posterUrl} 
              alt={`Постер ${animeTitle}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 50vw"
              className="object-cover !bg-transparent"
              style={{ backgroundColor: 'transparent' }}
              priority
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-400 to-rose-500">
              <div className="text-white text-center">
                <div className="text-3xl md:text-4xl mb-2">🎬</div>
                <div className="text-xs md:text-sm font-medium">{animeTitle}</div>
              </div>
            </div>
          )}
          <div className="absolute top-2 right-2 bg-pink-700 bg-opacity-80 text-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium">
            {animeTitle}
          </div>
          
          {/* Кнопка избранного */}
          <div className="absolute top-2 left-2">
            <button 
              onClick={handleFavoriteToggle}
              disabled={isLoading}
              className={`p-2 rounded-full transition-all duration-200 ${
                isFavorite 
                  ? 'bg-red-500 text-white shadow-lg' 
                  : 'bg-white bg-opacity-80 text-gray-600 hover:bg-opacity-100'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}`}
              title={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
            >
              <svg 
                className="w-4 h-4 md:w-5 md:h-5" 
                fill={isFavorite ? "currentColor" : "none"} 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      {/* Content */}
      <div className="p-4 md:p-6">
        <div className="flex justify-between items-start mb-3 md:mb-4">
          <h3 className="text-lg md:text-xl font-semibold text-pink-800 pr-2">{title}</h3>
          <div className="text-yellow-400 text-sm md:text-lg font-bold flex-shrink-0">
            {renderStars(rating)}
          </div>
        </div>
        
        <p className="text-pink-700 mb-3 md:mb-4 line-clamp-3 leading-relaxed text-sm md:text-base">{body}</p>
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-xs md:text-sm text-pink-600 gap-1 sm:gap-0">
          <span className="font-medium">Автор: {authorName}</span>
          <span>{formatDate(createdAt)}</span>
        </div>
        
        {/* Stats */}
        {_count && (
          <div className="flex items-center justify-center sm:justify-start space-x-3 md:space-x-4 mt-3 pt-3 border-t border-pink-100">
            <div className="flex items-center space-x-1 text-green-600">
              <span className="text-sm">👍</span>
              <span className="text-xs md:text-sm">{_count.likes}</span>
            </div>
            <div className="flex items-center space-x-1 text-red-600">
              <span className="text-sm">👎</span>
              <span className="text-xs md:text-sm">{_count.dislikes}</span>
            </div>
            <div className="flex items-center space-x-1 text-blue-600">
              <span className="text-sm">💬</span>
              <span className="text-xs md:text-sm">{_count.comments}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
