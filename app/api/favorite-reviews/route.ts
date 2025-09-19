import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../generated/prisma';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// GET - получить избранные отзывы пользователя
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; name: string };

    const favoriteReviews = await prisma.favoriteReview.findMany({
      where: { userId: decoded.userId },
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
      orderBy: { createdAt: 'desc' }
    });

    const formattedReviews = favoriteReviews.map(fav => ({
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
    }));

    return NextResponse.json(formattedReviews);
  } catch (error) {
    console.error('Error fetching favorite reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch favorite reviews' },
      { status: 500 }
    );
  }
}

// POST - добавить отзыв в избранное
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; name: string };

    const { reviewId } = await request.json();

    if (!reviewId) {
      return NextResponse.json(
        { error: 'Review ID is required' },
        { status: 400 }
      );
    }

    // Проверяем, не добавлен ли уже этот отзыв в избранное
    const existingFavorite = await prisma.favoriteReview.findFirst({
      where: {
        userId: decoded.userId,
        reviewId: reviewId
      }
    });

    if (existingFavorite) {
      return NextResponse.json(
        { error: 'Review already in favorites' },
        { status: 400 }
      );
    }

    // Добавляем в избранное
    const favorite = await prisma.favoriteReview.create({
      data: {
        reviewId,
        userId: decoded.userId
      }
    });

    return NextResponse.json(favorite);
  } catch (error) {
    console.error('Error adding favorite review:', error);
    return NextResponse.json(
      { error: 'Failed to add favorite review' },
      { status: 500 }
    );
  }
}

// DELETE - удалить отзыв из избранного
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; name: string };

    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get('reviewId');

    if (!reviewId) {
      return NextResponse.json(
        { error: 'Review ID is required' },
        { status: 400 }
      );
    }

    // Удаляем из избранного
    await prisma.favoriteReview.deleteMany({
      where: {
        userId: decoded.userId,
        reviewId: reviewId
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing favorite review:', error);
    return NextResponse.json(
      { error: 'Failed to remove favorite review' },
      { status: 500 }
    );
  }
}
