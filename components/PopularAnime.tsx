'use client';

import Image from 'next/image';
import { useState, useMemo } from 'react';
import { Review } from './LatestReviews';

interface PopularAnimeItem {
  name: string;
  likes: number;
  reviews: number;
  rating: number;
}

interface PopularAnimeProps {
  reviews: Review[];
}

const PopularAnime: React.FC<PopularAnimeProps> = ({ reviews }) => {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (animeName: string) => {
    setImageErrors(prev => ({ ...prev, [animeName]: true }));
  };

  // Вычисляем популярные аниме на основе отзывов
  const popularAnime = useMemo(() => {
    if (!reviews || reviews.length === 0) {
      return [];
    }

    // Группируем отзывы по названию аниме
    const animeStats = reviews.reduce((acc, review) => {
      const animeTitle = review.animeTitle;
      
      if (!acc[animeTitle]) {
        acc[animeTitle] = {
          name: animeTitle,
          likes: 0,
          reviews: 0,
          rating: 0,
          totalRating: 0
        };
      }
      
      acc[animeTitle].likes += review._count?.likes || 0;
      acc[animeTitle].reviews += 1;
      acc[animeTitle].totalRating += review.rating;
      
      return acc;
    }, {} as Record<string, PopularAnimeItem & { totalRating: number }>);

    // Преобразуем в массив и вычисляем средний рейтинг
    const animeList = Object.values(animeStats).map(anime => ({
      name: anime.name,
      likes: anime.likes,
      reviews: anime.reviews,
      rating: Math.round((anime.totalRating / anime.reviews) * 10) / 10
    }));

    // Сортируем по количеству лайков и берем топ-5
    return animeList
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 5);
  }, [reviews]);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-pink-200 p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-semibold text-pink-800 mb-4 md:mb-6">Популярные аниме</h2>
      {popularAnime.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
          {popularAnime.map((anime) => (
            <div key={anime.name} className="text-center cursor-pointer group">
              <div className="relative overflow-hidden rounded-lg mb-2 h-32 md:h-48">
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-400 to-emerald-500">
                  <div className="text-white text-center">
                    <div className="text-2xl md:text-4xl mb-1 md:mb-2">🎬</div>
                    <div className="text-xs md:text-sm font-medium">{anime.name}</div>
                  </div>
                </div>
              </div>
              <div className="text-xs md:text-sm font-medium text-pink-800">{anime.name}</div>
              <div className="text-xs text-pink-600">{anime.rating} ★</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-pink-600">Пока нет данных для отображения популярных аниме</p>
        </div>
      )}
    </div>
  );
};

export default PopularAnime;
