// Скрипт для выполнения миграций в продакшене
const { execSync } = require('child_process');

async function migrateProduction() {
  try {
    console.log('🚀 Выполнение миграций базы данных...');
    
    // Генерируем Prisma клиент
    console.log('📦 Генерация Prisma клиента...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    // Выполняем миграции
    console.log('🗄️ Выполнение миграций...');
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    
    console.log('✅ Миграции выполнены успешно!');
    
  } catch (error) {
    console.error('❌ Ошибка при выполнении миграций:', error);
    process.exit(1);
  }
}

migrateProduction();
