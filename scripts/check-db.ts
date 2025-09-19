import { PrismaClient } from '../app/generated/prisma';

const prisma = new PrismaClient();

async function checkDatabase() {
  console.log('🔍 Checking database...\n');

  try {
    // Проверяем пользователей
    const users = await prisma.user.findMany();
    console.log('👥 Users:');
    users.forEach(user => {
      console.log(`  - ID: ${user.id}`);
      console.log(`    Email: ${user.email}`);
      console.log(`    Name: ${user.name}`);
      console.log(`    Created: ${user.createdAt}`);
      console.log('');
    });

    // Проверяем отзывы
    const reviews = await prisma.review.findMany({
      include: {
        author: true
      }
    });
    console.log('📝 Reviews:');
    reviews.forEach(review => {
      console.log(`  - ID: ${review.id}`);
      console.log(`    Title: ${review.title}`);
      console.log(`    Anime: ${review.animeTitle}`);
      console.log(`    Rating: ${review.rating}`);
      console.log(`    Author: ${review.author.name || review.author.email}`);
      console.log(`    Created: ${review.createdAt}`);
      console.log('');
    });

    console.log(`📊 Summary:`);
    console.log(`  Users: ${users.length}`);
    console.log(`  Reviews: ${reviews.length}`);

  } catch (error) {
    console.error('❌ Error checking database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
