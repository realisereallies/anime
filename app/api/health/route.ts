import { NextResponse } from 'next/server';
import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Проверяем подключение к базе данных
    await prisma.$connect();
    
    // Проверяем, есть ли таблицы
    const userCount = await prisma.user.count();
    
    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      userCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json({
      status: 'error',
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
