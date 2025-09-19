'use client';

import Image from 'next/image';
import { useState } from 'react';

interface AnimeItem {
  name: string;
  poster: string;
}

interface PopularAnimeProps {
  animeList?: AnimeItem[];
}

const defaultAnimeList = [
  { 
    name: 'Атака Титанов', 
    poster: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=150&h=200&fit=crop' 
  },
  { 
    name: 'Наруто', 
    poster: 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=150&h=200&fit=crop' 
  },
  { 
    name: 'One Piece', 
    poster: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=150&h=200&fit=crop' 
  },
  { 
    name: 'Демон Слэйер', 
    poster: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=200&fit=crop' 
  },
  { 
    name: 'Моя Геройская Академия', 
    poster: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=150&h=200&fit=crop' 
  }
];

const PopularAnime: React.FC<PopularAnimeProps> = ({ animeList = defaultAnimeList }) => {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (animeName: string) => {
    setImageErrors(prev => ({ ...prev, [animeName]: true }));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-pink-200 p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-semibold text-pink-800 mb-4 md:mb-6">Популярные аниме</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
        {animeList.map((anime) => (
          <div key={anime.name} className="text-center cursor-pointer group">
            <div className="relative overflow-hidden rounded-lg mb-2 h-32 md:h-48">
              {!imageErrors[anime.name] ? (
                <Image 
                  src={anime.poster} 
                  alt={`Постер ${anime.name}`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-200 !bg-transparent"
                  priority
                  onError={(e) => {
                    console.error('PopularAnime image failed to load:', anime.name, anime.poster, e);
                    handleImageError(anime.name);
                  }}
                  onLoad={() => console.log('PopularAnime image loaded successfully:', anime.name, anime.poster)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-400 to-rose-500">
                  <div className="text-white text-center">
                    <div className="text-2xl md:text-4xl mb-1 md:mb-2">🎬</div>
                    <div className="text-xs md:text-sm font-medium">{anime.name}</div>
                  </div>
                </div>
              )}
            </div>
            <div className="text-xs md:text-sm font-medium text-pink-800">{anime.name}</div>
            <div className="text-xs text-pink-600">4.5 ★</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularAnime;
