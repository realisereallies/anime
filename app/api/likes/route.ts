import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../generated/prisma';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = 'your-secret-key-here';

// GET - получить количество лайков и дизлайков для отзыва
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get('reviewId');

    if (!reviewId) {
      return NextResponse.json(
        { error: 'Review ID is required' },
        { status: 400 }
      );
    }

    const [likesCount, dislikesCount] = await Promise.all([
      prisma.like.count({
        where: { reviewId }
      }),
      prisma.dislike.count({
        where: { reviewId }
      })
    ]);

    return NextResponse.json({
      likes: likesCount,
      dislikes: dislikesCount
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch likes/dislikes' },
      { status: 500 }
    );
  }
}

// POST - поставить лайк или дизлайк
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

    const { reviewId, action } = await request.json();

    if (!reviewId || !action) {
      return NextResponse.json(
        { error: 'Review ID and action are required' },
        { status: 400 }
      );
    }

    if (!['like', 'dislike', 'remove'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be like, dislike, or remove' },
        { status: 400 }
      );
    }

    // Удаляем существующие лайки и дизлайки пользователя для этого отзыва
    await Promise.all([
      prisma.like.deleteMany({
        where: {
          userId: decoded.userId,
          reviewId: reviewId
        }
      }),
      prisma.dislike.deleteMany({
        where: {
          userId: decoded.userId,
          reviewId: reviewId
        }
      })
    ]);

    // Если действие не "remove", создаем новый лайк или дизлайк
    if (action !== 'remove') {
      if (action === 'like') {
        await prisma.like.create({
          data: {
            userId: decoded.userId,
            reviewId: reviewId
          }
        });
      } else if (action === 'dislike') {
        await prisma.dislike.create({
          data: {
            userId: decoded.userId,
            reviewId: reviewId
          }
        });
      }
    }

    // Возвращаем обновленные счетчики
    const [likesCount, dislikesCount] = await Promise.all([
      prisma.like.count({
        where: { reviewId }
      }),
      prisma.dislike.count({
        where: { reviewId }
      })
    ]);

    return NextResponse.json({
      likes: likesCount,
      dislikes: dislikesCount,
      action: action
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to update like/dislike' },
      { status: 500 }
    );
  }
}
