'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ReviewFormData {
  title: string;
  body: string;
  rating: number;
  animeTitle: string;
}

export default function AddReviewPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ReviewFormData>({
    title: '',
    body: '',
    rating: 5,
    animeTitle: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Проверяем аутентификацию
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login');
      return;
    }
    setIsAuthenticated(true);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Необходимо войти в систему');
        return;
      }

      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        // Перенаправляем на главную страницу после успешного добавления
        router.push('/');
      } else {
        const data = await response.json();
        setError(data.error || 'Ошибка при добавлении отзыва');
      }
    } catch {
      setError('Ошибка сети');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }));
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
            className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Проверка авторизации...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50/30 to-rose-50/30">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-pink-200">
        <div className="max-w-6xl mx-auto px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-pink-800">Добавить отзыв</h1>
              <p className="text-pink-600 mt-1">Поделитесь своим мнением об аниме</p>
            </div>
            <div className="flex space-x-4">
              <Link 
                href="/" 
                className="bg-pink-400 text-white px-6 py-2 rounded-lg hover:bg-pink-500 transition-colors font-medium shadow-md"
              >
                Назад на главную
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg border border-pink-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Название аниме */}
            <div>
              <label htmlFor="animeTitle" className="block text-sm font-medium text-green-700 mb-2">
                Название аниме *
              </label>
              <input
                type="text"
                id="animeTitle"
                name="animeTitle"
                value={formData.animeTitle}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Например: Атака Титанов"
              />
            </div>

            {/* Заголовок отзыва */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-green-700 mb-2">
                Заголовок отзыва *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Краткое описание вашего мнения"
              />
            </div>

            {/* Рейтинг */}
            <div>
              <label className="block text-sm font-medium text-green-700 mb-2">
                Ваша оценка *
              </label>
              <div className="flex items-center space-x-4">
                {renderStars(formData.rating)}
                <span className="text-lg font-medium text-gray-900">{formData.rating}/5</span>
              </div>
            </div>

            {/* Текст отзыва */}
            <div>
              <label htmlFor="body" className="block text-sm font-medium text-green-700 mb-2">
                Текст отзыва *
              </label>
              <textarea
                id="body"
                name="body"
                value={formData.body}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full px-4 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-vertical"
                placeholder="Подробно опишите ваше мнение об аниме. Что понравилось, что не понравилось, ваши впечатления..."
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Добавление...
                  </div>
                ) : (
                  'Опубликовать отзыв'
                )}
              </button>
              <Link
                href="/"
                className="bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-medium shadow-md"
              >
                Отмена
              </Link>
            </div>
          </form>

          {/* Help Section */}
          <div className="mt-8 pt-6 border-t border-green-200">
            <h3 className="text-lg font-semibold text-green-800 mb-3">Как написать хороший отзыв?</h3>
            <div className="space-y-2 text-sm text-green-600">
              <p>• Опишите сюжет и персонажей</p>
              <p>• Поделитесь своими эмоциями и впечатлениями</p>
              <p>• Укажите сильные и слабые стороны</p>
              <p>• Поставьте честную оценку от 1 до 5 звезд</p>
              <p>• Будьте конструктивны и уважительны</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
