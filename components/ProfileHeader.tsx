'use client';

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

interface ProfileHeaderProps {
  user: User;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-pink-200 p-6 mb-8">
      <div className="flex items-center space-x-6">
        <div className="relative">
          <div className="w-[120px] h-[120px] rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-lg">
            <span className="text-4xl font-bold text-white">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <button className="absolute bottom-0 right-0 bg-pink-500 text-white p-2 rounded-full hover:bg-pink-600 transition-colors shadow-md">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-pink-800">{user.name}</h2>
          <p className="text-pink-600">{user.email}</p>
          
          {/* Stats */}
          <div className="flex space-x-6 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600">{user.totalReviews}</div>
              <div className="text-sm text-pink-500">Отзывов</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-rose-500">{user.averageRating}</div>
              <div className="text-sm text-pink-500">Средний рейтинг</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-700">{user.favoriteAnime}</div>
              <div className="text-sm text-pink-500">В избранном</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
