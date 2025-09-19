import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../generated/prisma';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// GET - проверить, добавлен ли отзыв в избранное
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { isFavorite: false },
        { status: 200 }
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

    const favorite = await prisma.favoriteReview.findFirst({
      where: {
        userId: decoded.userId,
        reviewId: reviewId
      }
    });

    return NextResponse.json({ 
      isFavorite: !!favorite,
      favoriteId: favorite?.id || null
    });
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return NextResponse.json(
      { isFavorite: false },
      { status: 200 }
    );
  }
}
