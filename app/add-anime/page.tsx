'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface AnimeFormData {
  title: string;
  posterUrl: string;
}

export default function AddAnimePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<AnimeFormData>({
    title: '',
    posterUrl: ''
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

      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          animeTitle: formData.title,
          posterUrl: formData.posterUrl || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=150&h=200&fit=crop'
        })
      });

      if (response.ok) {
        // Перенаправляем на профиль после успешного добавления
        router.push('/profile');
      } else {
        const data = await response.json();
        setError(data.error || 'Ошибка при добавлении аниме');
      }
    } catch {
      setError('Ошибка сети');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Добавить аниме</h1>
              <p className="text-gray-600 mt-1">Добавьте новое аниме в избранное</p>
            </div>
            <div className="flex space-x-4">
              <Link 
                href="/profile" 
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Назад в профиль
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Название аниме */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Название аниме *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Например: Атака Титанов"
              />
            </div>

            {/* URL постера */}
            <div>
              <label htmlFor="posterUrl" className="block text-sm font-medium text-gray-700 mb-2">
                URL постера (необязательно)
              </label>
              <input
                type="url"
                id="posterUrl"
                name="posterUrl"
                value={formData.posterUrl}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/poster.jpg"
              />
              <p className="text-sm text-gray-500 mt-1">
                Если не указать URL, будет использован стандартный постер
              </p>
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
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Добавление...
                  </div>
                ) : (
                  'Добавить в избранное'
                )}
              </button>
              <Link
                href="/profile"
                className="bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Отмена
              </Link>
            </div>
          </form>

          {/* Help Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Как добавить аниме?</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>1. Введите точное название аниме</p>
              <p>2. При желании укажите URL постера</p>
              <p>3. Нажмите &quot;Добавить в избранное&quot;</p>
              <p>4. Аниме появится в вашем профиле на вкладке &quot;Избранное&quot;</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
