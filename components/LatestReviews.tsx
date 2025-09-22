'use client';

import { useState, useEffect } from 'react';
import ReviewCard from './ReviewCard';

export interface Review {
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

interface LatestReviewsProps {
  reviews: Review[];
  loading: boolean;
}

export default function LatestReviews({ reviews, loading }: LatestReviewsProps) {


  return (
    <div className="mb-8">
      <h2 className="text-xl md:text-2xl font-semibold text-pink-800 mb-4 md:mb-6">Последние отзывы</h2>
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-pink-600">Загрузка отзывов...</p>
        </div>
      ) : reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
