import { PrismaClient } from '../app/generated/prisma';

const prisma = new PrismaClient();

async function checkReviews() {
  try {
    console.log('🔍 Проверяем отзывы в базе данных...');
    
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
      }
    });

    console.log(`📊 Найдено отзывов: ${reviews.length}`);
    
    if (reviews.length > 0) {
      console.log('\n📝 Список отзывов:');
      reviews.forEach((review, index) => {
        console.log(`${index + 1}. "${review.title}" - ${review.animeTitle} (${review.rating}/5)`);
        console.log(`   Автор: ${review.author.name || review.author.email}`);
        console.log(`   Лайки: ${review._count.likes}, Дизлайки: ${review._count.dislikes}, Комментарии: ${review._count.comments}`);
        console.log(`   Дата: ${review.createdAt.toLocaleDateString('ru-RU')}`);
        console.log('');
      });
    } else {
      console.log('❌ Отзывы не найдены!');
    }

    const users = await prisma.user.findMany();
    console.log(`👥 Пользователей в базе: ${users.length}`);
    
  } catch (error) {
    console.error('❌ Ошибка при проверке базы данных:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkReviews();
