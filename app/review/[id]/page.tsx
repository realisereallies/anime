'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { getUserFromToken } from '../../../utils/jwt';

interface Review {
  id: string;
  title: string;
  body: string;
  rating: number;
  animeTitle: string;
  authorName: string;
  createdAt: string;
  posterUrl?: string;
  _count?: {
    likes: number;
    dislikes: number;
    comments: number;
  };
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
}

export default function ReviewPage() {
  const params = useParams();
  const router = useRouter();
  const [review, setReview] = useState<Review | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userAction, setUserAction] = useState<'like' | 'dislike' | null>(null);
  const [imageError, setImageError] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');

  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(`/api/comments?reviewId=${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch {
      console.error('Error fetching comments');
    }
  }, [params.id]);

  const fetchReview = useCallback(async () => {
    try {
      const response = await fetch('/api/reviews');
      if (response.ok) {
        const data = await response.json();
        const foundReview = data.find((r: { id: string }) => r.id === params.id);
        if (foundReview) {
          const formattedReview: Review = {
            id: foundReview.id,
            title: foundReview.title,
            body: foundReview.body,
            rating: foundReview.rating,
            animeTitle: foundReview.animeTitle, 
            authorName: foundReview.author.name || 'Пользователь',
            createdAt: foundReview.createdAt,
            posterUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
            _count: foundReview._count
          };
          setReview(formattedReview);
          setLikes(formattedReview._count?.likes || 0);
          setDislikes(formattedReview._count?.dislikes || 0);
          fetchComments();
        }
      }
    } catch {
      console.error('Error fetching review');
    } finally {
      setLoading(false);
    }
  }, [params.id, fetchComments]);

  useEffect(() => {
    // Проверяем аутентификацию
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        setIsAuthenticated(true);
        const userData = getUserFromToken(token);
        if (userData) {
          setUserName(userData.name);
        } else {
          setUserName('Пользователь');
        }
      }
    } catch {
      // Ошибка при проверке аутентификации
    }

    // Загружаем отзыв
    if (params.id) {
      fetchReview();
    }
  }, [params.id, fetchReview]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Необходимо войти в систему');
        return;
      }

      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: newComment,
          reviewId: params.id
        })
      });

      if (response.ok) {
        setNewComment('');
        fetchComments();
      } else {
        alert('Ошибка при добавлении комментария');
      }
    } catch {
      alert('Ошибка сети');
    }
  };

  const handleLikeDislike = async (action: 'like' | 'dislike') => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Необходимо войти в систему');
        return;
      }

      const newAction = userAction === action ? 'remove' : action;

      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          reviewId: params.id,
          action: newAction
        })
      });

      if (response.ok) {
        const data = await response.json();
        setLikes(data.likes);
        setDislikes(data.dislikes);
        setUserAction(newAction === 'remove' ? null : newAction);
      }
    } catch (error) {
      console.error('Error updating like/dislike:', error);
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('authToken');
      setIsAuthenticated(false);
      setUserName('');
      router.push('/');
    } catch {
      router.push('/');
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50/30 to-rose-50/30">
        <Header 
          isAuthenticated={isAuthenticated}
          userName={userName}
          onLogout={handleLogout}
        />
        <div className="max-w-4xl mx-auto px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
            <p className="text-pink-600">Загрузка отзыва...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!review) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50/30 to-rose-50/30">
        <Header 
          isAuthenticated={isAuthenticated}
          userName={userName}
          onLogout={handleLogout}
        />
        <div className="max-w-4xl mx-auto px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-pink-800 mb-4">Отзыв не найден</h1>
            <button
              onClick={() => router.push('/')}
              className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors"
            >
              Вернуться на главную
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50/30 to-rose-50/30">
      <Header 
        isAuthenticated={isAuthenticated}
        userName={userName}
        onLogout={handleLogout}
      />

      <main className="max-w-4xl mx-auto px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push('/')}
          className="mb-6 text-pink-600 hover:text-pink-800 flex items-center space-x-2"
        >
          <span>←</span>
          <span>Назад к отзывам</span>
        </button>

        {/* Review Content */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Poster */}
          {review.posterUrl && (
            <div className="w-full h-80 bg-pink-50 relative overflow-hidden">
              {!imageError ? (
                <Image 
                  src={review.posterUrl} 
                  alt={`Постер ${review.animeTitle}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-400 to-rose-500">
                  <div className="text-white text-center">
                    <div className="text-6xl mb-4">🎬</div>
                    <div className="text-xl font-medium">{review.animeTitle}</div>
                  </div>
                </div>
              )}
              <div className="absolute top-4 right-4 bg-pink-700 bg-opacity-80 text-white px-4 py-2 rounded-full text-lg font-medium">
                {review.animeTitle}
              </div>
            </div>
          )}

          {/* Review Info */}
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-4xl font-bold text-pink-800">{review.title}</h1>
              <div className="text-yellow-400 text-3xl font-bold">
                {renderStars(review.rating)}
              </div>
            </div>
            
            <p className="text-pink-700 text-lg leading-relaxed mb-6">{review.body}</p>
            
            <div className="flex justify-between items-center text-pink-600 mb-6">
              <span className="font-medium text-lg">Автор: {review.authorName}</span>
              <span className="text-lg">{formatDate(review.createdAt)}</span>
            </div>

            {/* Like/Dislike Buttons */}
            <div className="flex items-center space-x-4 mb-8 p-4 bg-pink-50 rounded-lg">
              <button
                onClick={() => handleLikeDislike('like')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
                  userAction === 'like' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-white text-green-600 border border-green-300 hover:bg-green-50'
                }`}
              >
                <span>👍</span>
                <span>{likes}</span>
              </button>
              <button
                onClick={() => handleLikeDislike('dislike')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
                  userAction === 'dislike' 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white text-red-600 border border-red-300 hover:bg-red-50'
                }`}
              >
                <span>👎</span>
                <span>{dislikes}</span>
              </button>
            </div>

            {/* Comments Section */}
            <div className="border-t border-pink-200 pt-8">
              <h2 className="text-2xl font-semibold text-pink-800 mb-6">
                Комментарии ({comments.length})
              </h2>

              {/* Add Comment Form */}
              {isAuthenticated && (
                <form onSubmit={handleCommentSubmit} className="mb-8">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Напишите ваш комментарий..."
                    className="w-full p-4 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                    rows={4}
                  />
                  <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="mt-3 bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Отправить комментарий
                  </button>
                </form>
              )}

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-pink-50 p-6 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <span className="font-medium text-pink-800">
                        {comment.user.name || comment.user.email}
                      </span>
                      <span className="text-sm text-pink-600">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-pink-700">{comment.content}</p>
                  </div>
                ))}
                {comments.length === 0 && (
                  <p className="text-pink-600 text-center py-8">
                    Пока нет комментариев. Будьте первым!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
