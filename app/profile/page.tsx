'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProfileHeader from '../../components/ProfileHeader';
import ProfileTabs from '../../components/ProfileTabs';


interface Review {
  id: string;
  title: string;
  body: string;
  rating: number;
  animeTitle: string;
  authorName: string;
  createdAt: string;
  posterUrl?: string;
}

interface ProfileData {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinDate: string;
  totalReviews: number;
  averageRating: number;
  favoriteAnime: number;
  reviews: Review[];
  favoriteReviews: Review[];
}


export default function ProfilePage() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        
        // Получаем токен из localStorage
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          setError('Необходима авторизация');
          setLoading(false);
          return;
        }

        const response = await fetch('/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.status === 401) {
          setError('Необходима авторизация');
          localStorage.removeItem('authToken');
        } else if (!response.ok) {
          throw new Error('Failed to fetch profile');
        } else {
          const data = await response.json();
          setProfileData(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50/30 to-rose-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-pink-600">Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50/30 to-rose-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">
            {error === 'Необходима авторизация' ? 'Необходима авторизация' : 'Ошибка загрузки профиля'}
          </div>
          <p className="text-pink-600 mb-4">
            {error === 'Необходима авторизация' 
              ? 'Для доступа к личному кабинету необходимо войти в систему' 
              : (error || 'Профиль не найден')
            }
          </p>
          <div className="space-x-4">
            <Link href="/login" className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors shadow-md">
              Войти
            </Link>
            <Link href="/" className="bg-rose-400 text-white px-6 py-2 rounded-lg hover:bg-rose-500 transition-colors shadow-md">
              Вернуться на главную
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Преобразуем данные для компонентов
  const user = {
    id: profileData.id,
    name: profileData.name,
    email: profileData.email,
    avatar: profileData.avatar,
    joinDate: new Date(profileData.joinDate),
    totalReviews: profileData.totalReviews,
    averageRating: profileData.averageRating,
    favoriteAnime: profileData.favoriteAnime
  };

  const userReviews = profileData.reviews.map(review => ({
    ...review,
    createdAt: new Date(review.createdAt)
  }));

  const favoriteReviews = (profileData.favoriteReviews || []).map(review => ({
    ...review,
    createdAt: new Date(review.createdAt)
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50/30 to-rose-50/30">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-pink-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-pink-800">Личный кабинет</h1>
              <p className="text-pink-600 mt-1 text-sm sm:text-base">Управление профилем и отзывами</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <button 
                onClick={() => {
                  window.location.href = '/';
                }}
                className="bg-pink-400 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-pink-500 transition-colors font-medium shadow-md text-sm sm:text-base"
              >
                Назад на главную
              </button>
              <button 
                onClick={() => {
                  localStorage.removeItem('authToken');
                  window.location.href = '/login';
                }}
                className="bg-rose-500 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-rose-600 transition-colors font-medium shadow-md text-sm sm:text-base"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-4 sm:py-8">
        {/* Profile Header Component */}
        <ProfileHeader user={user} />
        
        {/* Profile Tabs Component */}
        <ProfileTabs userReviews={userReviews} favoriteReviews={favoriteReviews} user={user} />
      </main>
    </div>
  );
}
