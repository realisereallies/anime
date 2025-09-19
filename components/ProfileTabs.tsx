'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ReviewCard from './ReviewCard';

interface Review {
  id: string;
  title: string;
  body: string;
  rating: number;
  animeTitle: string;
  authorName: string;
  createdAt: Date;
  posterUrl?: string;
}

interface AnimeItem {
  name: string;
  poster: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinDate: Date;
  totalReviews: number;
  averageRating: number;
  favoriteAnime: number;
}

interface ProfileTabsProps {
  userReviews: Review[];
  favoriteAnime: AnimeItem[];
  user: User;
}

interface AnimeItem {
  id: string;
  name: string;
  poster: string;
}

export default function ProfileTabs({ userReviews, favoriteAnime, user }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const [favorites, setFavorites] = useState<AnimeItem[]>(favoriteAnime);

  // Отладка: выводим данные в консоль
  console.log('ProfileTabs получил данные:', { userReviews, favoriteAnime, favorites });

  const handleRemoveFavorite = async (favoriteId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Необходимо войти в систему');
        return;
      }

      console.log('Удаляем избранное с ID:', favoriteId);

      const response = await fetch(`/api/favorites?id=${favoriteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Ответ сервера:', response.status);

      if (response.ok) {
        // Удаляем из локального состояния
        setFavorites(prev => prev.filter(fav => fav.id !== favoriteId));
        alert('Аниме удалено из избранного!');
        // Перезагружаем страницу для обновления статистики
        setTimeout(() => window.location.reload(), 1000);
      } else {
        const errorData = await response.json();
        console.error('Ошибка сервера:', errorData);
        alert(`Ошибка при удалении: ${errorData.error || 'Неизвестная ошибка'}`);
      }
    } catch (error) {
      console.error('Ошибка сети:', error);
      alert('Ошибка сети при удалении из избранного');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-pink-200 mb-8">
      <div className="border-b border-pink-200">
        <nav className="flex overflow-x-auto space-x-2 sm:space-x-8 px-4 sm:px-6">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
              activeTab === 'profile'
                ? 'border-pink-500 text-pink-600'
                : 'border-transparent text-pink-400 hover:text-pink-600 hover:border-pink-300'
            }`}
          >
            Профиль
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-3 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'border-pink-500 text-pink-600'
                : 'border-transparent text-pink-400 hover:text-pink-600 hover:border-pink-300'
            }`}
          >
            Мои отзывы
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`py-3 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
              activeTab === 'favorites'
                ? 'border-pink-500 text-pink-600'
                : 'border-transparent text-pink-400 hover:text-pink-600 hover:border-pink-300'
            }`}
          >
            Избранное
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-pink-500 text-pink-600'
                : 'border-transparent text-pink-400 hover:text-pink-600 hover:border-pink-300'
            }`}
          >
            Настройки
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-4 sm:p-6">
        {activeTab === 'profile' && (
          <div>
            <h3 className="text-lg font-semibold text-pink-800 mb-4">Информация о профиле</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-pink-700 mb-1">Имя</label>
                <input
                  type="text"
                  defaultValue={user.name}
                  className="w-full px-3 py-2 border border-pink-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-pink-700 mb-1">Email</label>
                <input
                  type="email"
                  defaultValue={user.email}
                  className="w-full px-3 py-2 border border-pink-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-pink-700 mb-1">О себе</label>
                <textarea
                  rows={4}
                  placeholder="Расскажите о себе..."
                  className="w-full px-3 py-2 border border-pink-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <button className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors shadow-md">
                Сохранить изменения
              </button>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
              <h3 className="text-lg font-semibold text-pink-800">Мои отзывы</h3>
              <button className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors shadow-md text-sm sm:text-base">
                Добавить отзыв
              </button>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {userReviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  id={review.id}
                  title={review.title}
                  body={review.body}
                  rating={review.rating}
                  animeTitle={review.animeTitle}
                  authorName={review.authorName}
                  createdAt={review.createdAt}
                  posterUrl={review.posterUrl}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'favorites' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
              <h3 className="text-lg font-semibold text-pink-800">Избранные аниме</h3>
              <Link 
                href="/add-anime"
                className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors font-medium shadow-md text-sm sm:text-base"
              >
                + Добавить аниме
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
              {favorites.map((anime) => (
                <div key={anime.id} className="text-center group">
                  <div className="relative overflow-hidden rounded-lg mb-2 h-32 sm:h-48">
                    <Image 
                      src={anime.poster} 
                      alt={`Постер ${anime.name}`}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-200 !bg-transparent"
                      style={{ backgroundColor: 'transparent' }}
                    />
                    <div className="absolute top-1 right-1 sm:top-2 sm:right-2 z-20">
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('Клик по кнопке удаления для аниме:', anime.name, 'ID:', anime.id);
                          handleRemoveFavorite(anime.id);
                        }}
                        className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                        title="Удалить из избранного"
                        type="button"
                      >
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-pink-800">{anime.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h3 className="text-lg font-semibold text-pink-800 mb-4">Настройки аккаунта</h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-md font-medium text-pink-700 mb-3">Уведомления</h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="rounded border-pink-300 text-pink-600 focus:ring-pink-500" />
                    <span className="ml-2 text-sm text-pink-700">Новые отзывы на избранные аниме</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="rounded border-pink-300 text-pink-600 focus:ring-pink-500" />
                    <span className="ml-2 text-sm text-pink-700">Ответы на мои отзывы</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-pink-300 text-pink-600 focus:ring-pink-500" />
                    <span className="ml-2 text-sm text-pink-700">Рекомендации аниме</span>
                  </label>
                </div>
              </div>
              
              <div>
                <h4 className="text-md font-medium text-pink-700 mb-3">Приватность</h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="rounded border-pink-300 text-pink-600 focus:ring-pink-500" />
                    <span className="ml-2 text-sm text-pink-700">Публичный профиль</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-pink-300 text-pink-600 focus:ring-pink-500" />
                    <span className="ml-2 text-sm text-pink-700">Показывать email</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-pink-200">
                <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors">
                  Удалить аккаунт
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
