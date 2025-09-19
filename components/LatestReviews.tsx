'use client';

import { useState, useEffect } from 'react';
import ReviewCard from './ReviewCard';

interface Review {
  id: string;
  title: string;
  body: string;
  rating: number;
  animeTitle: string;
  authorName: string;
  createdAt: string;
  posterUrl: string;
  _count?: {
    likes: number;
    dislikes: number;
    comments: number;
  };
}

export default function LatestReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('/api/reviews');
        if (response.ok) {
          const data = await response.json();
          const formattedReviews = data.map((review: { 
            id: string; 
            title: string; 
            body: string; 
            rating: number; 
            animeTitle: string; 
            author: { name: string | null }; 
            createdAt: string;
            _count?: {
              likes: number;
              dislikes: number;
              comments: number;
            };
          }) => ({
            id: review.id,
            title: review.title,
            body: review.body,
            rating: review.rating,
            animeTitle: review.animeTitle,
            authorName: review.author.name || 'Пользователь',
            createdAt: review.createdAt,
            posterUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
            _count: review._count
          }));
          setReviews(formattedReviews);
        }
      } catch {
        // Ошибка при загрузке отзывов
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);


  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-pink-800 mb-6">Последние отзывы</h2>
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-pink-600">Загрузка отзывов...</p>
        </div>
      ) : reviews.length > 0 ? (
        <div className="grid grid-cols-2 gap-6">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              id={review.id}
              title={review.title}
              body={review.body}
              rating={review.rating}
              animeTitle={review.animeTitle}
              authorName={review.authorName}
              createdAt={new Date(review.createdAt)}
              posterUrl={review.posterUrl}
              _count={review._count}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-pink-600">Пока нет отзывов. Будьте первым!</p>
        </div>
      )}
    </div>
  );
}
