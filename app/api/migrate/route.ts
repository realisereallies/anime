import { NextResponse } from 'next/server';
import { execSync } from 'child_process';

export async function POST() {
  try {
    console.log('🚀 Выполнение миграций базы данных...');
    
    // Генерируем Prisma клиент
    console.log('📦 Генерация Prisma клиента...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    // Выполняем миграции
    console.log('🗄️ Выполнение миграций...');
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    
    return NextResponse.json({
      status: 'success',
      message: 'Миграции выполнены успешно!',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Ошибка при выполнении миграций:', error);
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
