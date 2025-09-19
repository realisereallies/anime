'use client';

import Link from 'next/link';

interface HeaderProps {
  isAuthenticated: boolean;
  userName: string;
  onLogout: () => void;
}

export default function Header({ isAuthenticated, userName, onLogout }: HeaderProps) {
  return (
    <header className="bg-white shadow-lg border-b border-pink-200">
      <div className="max-w-6xl mx-auto px-8 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-pink-800">Аниме Отзывы</h1>
            <p className="text-pink-600 mt-1">Лучшие отзывы на аниме от сообщества</p>
          </div>
          <div className="flex space-x-4">
            <Link href="/add-review" className="bg-pink-400 text-white px-6 py-2 rounded-lg hover:bg-pink-500 transition-colors font-medium shadow-md">
              Добавить отзыв
            </Link>
            {isAuthenticated ? (
              <>
                <span className="text-pink-700 px-4 py-2 font-medium">Привет, {userName}!</span>
                <Link href="/profile" className="bg-rose-400 text-white px-6 py-2 rounded-lg hover:bg-rose-500 transition-colors font-medium shadow-md">
                  Личный кабинет
                </Link>
                <button 
                  onClick={onLogout}
                  className="bg-red-400 text-white px-6 py-2 rounded-lg hover:bg-red-500 transition-colors font-medium shadow-md"
                >
                  Выйти
                </button>
              </>
            ) : (
              <>
                <Link href="/register" className="bg-rose-400 text-white px-6 py-2 rounded-lg hover:bg-rose-500 transition-colors font-medium shadow-md">
                  Регистрация
                </Link>
                <Link href="/login" className="bg-pink-400 text-white px-6 py-2 rounded-lg hover:bg-pink-500 transition-colors font-medium shadow-md">
                  Войти
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
