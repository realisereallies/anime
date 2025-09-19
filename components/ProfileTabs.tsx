'use client';

import { useState } from 'react';
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
  _count?: {
    likes: number;
    dislikes: number;
    comments: number;
  };
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
  favoriteReviews: Review[];
  user: User;
}


export default function ProfileTabs({ userReviews, favoriteReviews, user }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState('profile');



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
            onClick={() => setActiveTab('favoriteReviews')}
            className={`py-3 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
              activeTab === 'favoriteReviews'
                ? 'border-pink-500 text-pink-600'
                : 'border-transparent text-pink-400 hover:text-pink-600 hover:border-pink-300'
            }`}
          >
            Избранные отзывы
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


        {activeTab === 'favoriteReviews' && (
          <div>
            <h3 className="text-lg font-semibold text-pink-800 mb-6">Избранные отзывы</h3>
            {favoriteReviews.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">💔</div>
                <p className="text-pink-600 text-lg">У вас пока нет избранных отзывов</p>
                <p className="text-pink-500 text-sm mt-2">Нажимайте на сердечки в отзывах, чтобы добавить их в избранное</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {favoriteReviews.map((review) => (
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
                    _count={review._count}
                  />
                ))}
              </div>
            )}
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
