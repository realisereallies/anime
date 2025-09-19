'use client';

import Link from 'next/link';
import { useState } from 'react';

interface HeaderProps {
  isAuthenticated: boolean;
  userName: string;
  onLogout: () => void;
}

export default function Header({ isAuthenticated, userName, onLogout }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-lg border-b border-pink-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-4 sm:py-6">
        {/* Desktop Header */}
        <div className="hidden md:flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-pink-800">Аниме Отзывы</h1>
            <p className="text-pink-600 mt-1">Лучшие отзывы на аниме от сообщества</p>
          </div>
          <div className="flex space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-pink-700 px-4 py-2 font-medium">Привет, {userName}!</span>
                <Link href="/add-review" className="bg-pink-400 text-white px-6 py-2 rounded-lg hover:bg-pink-500 transition-colors font-medium shadow-md">
                  Добавить отзыв
                </Link>
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

        {/* Mobile Header */}
        <div className="md:hidden">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <h1 className="text-xl font-bold text-pink-800">Аниме Отзывы</h1>
              <p className="text-sm text-pink-600">Лучшие отзывы</p>
            </div>
            <div className="flex items-center space-x-3">
              {isAuthenticated && (
                <div className="text-pink-700 text-sm font-medium bg-pink-50 px-3 py-1 rounded-lg">
                  Привет, {userName}!
                </div>
              )}
              <button
                onClick={toggleMobileMenu}
                className="p-2 text-pink-600 hover:text-pink-800"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="mt-4 space-y-2 border-t border-pink-200 pt-4">
              {isAuthenticated ? (
                <>
                  <Link 
                    href="/add-review" 
                    className="block bg-pink-400 text-white px-4 py-2 rounded-lg text-center font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Добавить отзыв
                  </Link>
                  <Link 
                    href="/profile" 
                    className="block bg-rose-400 text-white px-4 py-2 rounded-lg text-center font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Личный кабинет
                  </Link>
                  <button 
                    onClick={() => {
                      onLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bg-red-400 text-white px-4 py-2 rounded-lg font-medium"
                  >
                    Выйти
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/register" 
                    className="block bg-rose-400 text-white px-4 py-2 rounded-lg text-center font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Регистрация
                  </Link>
                  <Link 
                    href="/login" 
                    className="block bg-pink-400 text-white px-4 py-2 rounded-lg text-center font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Войти
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
