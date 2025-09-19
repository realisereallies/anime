'use client';

import React, { useState, useEffect } from 'react';

interface StatsData {
  totalReviews: number;
  animeCount: number;
  averageRating: number;
  userCount: number;
}

interface StatsGridProps {
  totalReviews?: number;
  animeCount?: number;
  averageRating?: number;
  userCount?: number;
}

const StatsGrid: React.FC<StatsGridProps> = (props) => {
  const [stats, setStats] = useState<StatsData>({
    totalReviews: props.totalReviews || 0,
    animeCount: props.animeCount || 0,
    averageRating: props.averageRating || 0,
    userCount: props.userCount || 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/stats');
        
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white p-4 md:p-6 rounded-lg shadow-sm border animate-pulse">
            <div className="h-6 md:h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 md:h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div className="col-span-2 md:col-span-4 bg-red-50 p-4 md:p-6 rounded-lg border border-red-200">
          <div className="text-red-600 text-sm md:text-base">Ошибка загрузки статистики: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border border-pink-100 hover:shadow-xl transition-shadow">
        <div className="text-2xl md:text-3xl font-bold text-pink-500 mb-2">{stats.totalReviews}</div>
        <div className="text-pink-700 font-medium text-sm md:text-base">Всего отзывов</div>
      </div>
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border border-pink-100 hover:shadow-xl transition-shadow">
        <div className="text-2xl md:text-3xl font-bold text-rose-500 mb-2">{stats.animeCount}</div>
        <div className="text-rose-700 font-medium text-sm md:text-base">Аниме в базе</div>
      </div>
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border border-pink-100 hover:shadow-xl transition-shadow">
        <div className="text-2xl md:text-3xl font-bold text-pink-400 mb-2">{stats.averageRating}</div>
        <div className="text-pink-600 font-medium text-sm md:text-base">Средний рейтинг</div>
      </div>
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border border-pink-100 hover:shadow-xl transition-shadow">
        <div className="text-2xl md:text-3xl font-bold text-pink-500 mb-2">{stats.userCount.toLocaleString()}</div>
        <div className="text-pink-700 font-medium text-sm md:text-base">Пользователей</div>
      </div>
    </div>
  );
};

export default StatsGrid;
