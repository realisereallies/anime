'use client';

import { useState, useEffect } from 'react';
import StatsGrid from '../components/StatsGrid';
import PopularAnime from '../components/PopularAnime';
import LatestReviews from '../components/LatestReviews';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getUserFromToken } from '../utils/jwt';


export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      // Проверяем, есть ли токен в localStorage
      const token = localStorage.getItem('authToken');
      if (token) {
        setIsAuthenticated(true);
        // Получаем данные пользователя из JWT токена
        const userData = getUserFromToken(token);
        if (userData) {
          setUserName(userData.name);
        } else {
          setUserName('Пользователь');
        }
      }
    } catch {
      // Ошибка при проверке аутентификации
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem('authToken');
      setIsAuthenticated(false);
      setUserName('');
      window.location.reload();
    } catch {
      // Fallback - просто перезагружаем страницу
      window.location.reload();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50/30 to-rose-50/30">
      {/* Header */}
      <Header 
        isAuthenticated={isAuthenticated}
        userName={userName}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-8 py-8">
        {/* Stats */}
        <StatsGrid />

        {/* Latest Reviews */}
        <LatestReviews />

        {/* Popular Anime */}
        <PopularAnime />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
