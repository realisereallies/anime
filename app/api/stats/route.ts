import { NextResponse } from 'next/server';
import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Получаем общее количество отзывов
    const totalReviews = await prisma.review.count();
    
    // Получаем количество уникальных аниме (по названию)
    const uniqueAnime = await prisma.review.findMany({
      select: {
        animeTitle: true
      },
      distinct: ['animeTitle']
    });
    const animeCount = uniqueAnime.length;
    
    // Получаем средний рейтинг
    const averageRating = await prisma.review.aggregate({
      _avg: {
        rating: true
      }
    }).then(result => result._avg.rating || 0);
    
    // Получаем количество пользователей
    const userCount = await prisma.user.count();
    
    // Получаем количество избранных отзывов
    const favoriteReviewsCount = await prisma.favoriteReview.count();
    
    return NextResponse.json({
      totalReviews,
      animeCount,
      averageRating: Math.round(averageRating * 10) / 10, // Округляем до одного знака после запятой
      userCount,
      favoriteReviewsCount
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch statistics',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
