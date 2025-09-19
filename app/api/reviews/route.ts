import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../generated/prisma';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// GET - получить все отзывы
export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            likes: true,
            dislikes: true,
            comments: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST - добавить новый отзыв
export async function POST(request: NextRequest) {
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
    
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; name: string };
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError);
      return NextResponse.json(
        { error: 'Invalid or expired token. Please log in again.' },
        { status: 401 }
      );
    }

    const { title, body, rating, animeTitle } = await request.json();

    // Валидация данных
    if (!title || !body || !rating || !animeTitle) {
      return NextResponse.json(
        { error: 'Все поля обязательны для заполнения' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Рейтинг должен быть от 1 до 5' },
        { status: 400 }
      );
    }

    // Создаем новый отзыв
    const review = await prisma.review.create({
      data: {
        title,
        body,
        rating,
        animeTitle,
        userId: decoded.userId
      },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}
