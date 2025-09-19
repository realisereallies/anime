import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../generated/prisma';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

export async function GET(request: NextRequest) {
  try {
    // Получаем токен из заголовка
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    // Проверяем токен
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; name: string };
    
    // Получаем пользователя по ID из токена
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        reviews: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        },
        favoriteReviews: {
          include: {
            review: {
              include: {
                author: {
                  select: {
                    name: true,
                    id: true
                  }
                },
                _count: {
                  select: {
                    likes: true,
                    dislikes: true,
                    comments: true
                  }
                }
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });
      if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Получаем статистику пользователя
    const totalReviews = user.reviews.length;
    const averageRating = user.reviews.length > 0 
      ? user.reviews.reduce((sum, review) => sum + review.rating, 0) / user.reviews.length
      : 0;
    const favoriteReviewsCount = user.favoriteReviews.length;

    // Формируем данные профиля
    const profileData = {
      id: user.id,
      name: user.name || 'Пользователь',
      email: user.email,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop', // Временный аватар
      joinDate: user.createdAt,
      totalReviews,
      averageRating: Math.round(averageRating * 10) / 10,
      favoriteAnime: favoriteReviewsCount,
      reviews: user.reviews.map(review => ({
        id: review.id,
        title: review.title,
        body: review.body,
        rating: review.rating,
        animeTitle: review.animeTitle,
        authorName: user.name || 'Пользователь',
        createdAt: review.createdAt,
        posterUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop' // Временный постер
      })),
      favoriteReviews: user.favoriteReviews.map(fav => ({
        id: fav.review.id,
        title: fav.review.title,
        body: fav.review.body,
        rating: fav.review.rating,
        animeTitle: fav.review.animeTitle,
        authorName: fav.review.author.name || 'Пользователь',
        createdAt: fav.review.createdAt,
        posterUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        _count: fav.review._count,
        favoriteId: fav.id
      }))
    };

    return NextResponse.json(profileData);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}
