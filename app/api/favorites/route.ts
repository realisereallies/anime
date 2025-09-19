import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../generated/prisma';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// В реальном приложении это должно быть в переменных окружения
const JWT_SECRET = 'your-secret-key-here';

// GET - получить избранные аниме пользователя
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
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; name: string };

    // Получаем избранные аниме пользователя
    const favorites = await prisma.favorite.findMany({
      where: { userId: decoded.userId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 }
    );
  }
}

// POST - добавить аниме в избранное
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
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; name: string };

    const { animeTitle, posterUrl } = await request.json();

    if (!animeTitle) {
      return NextResponse.json(
        { error: 'Anime title is required' },
        { status: 400 }
      );
    }

    // Проверяем, не добавлено ли уже это аниме в избранное
    const existingFavorite = await prisma.favorite.findFirst({
      where: {
        userId: decoded.userId,
        animeTitle: animeTitle
      }
    });

    if (existingFavorite) {
      return NextResponse.json(
        { error: 'Anime already in favorites' },
        { status: 400 }
      );
    }

    // Добавляем в избранное
    const favorite = await prisma.favorite.create({
      data: {
        animeTitle,
        posterUrl,
        userId: decoded.userId
      }
    });

    return NextResponse.json(favorite);
  } catch (error) {
    console.error('Error adding favorite:', error);
    return NextResponse.json(
      { error: 'Failed to add favorite' },
      { status: 500 }
    );
  }
}

// DELETE - удалить аниме из избранного
export async function DELETE(request: NextRequest) {
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
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; name: string };

    const { searchParams } = new URL(request.url);
    const favoriteId = searchParams.get('id');

    if (!favoriteId) {
      return NextResponse.json(
        { error: 'Favorite ID is required' },
        { status: 400 }
      );
    }

    // Удаляем из избранного
    await prisma.favorite.delete({
      where: {
        id: favoriteId,
        userId: decoded.userId // Убеждаемся, что пользователь удаляет свое избранное
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing favorite:', error);
    return NextResponse.json(
      { error: 'Failed to remove favorite' },
      { status: 500 }
    );
  }
}
