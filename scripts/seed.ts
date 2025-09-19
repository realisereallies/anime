import { PrismaClient } from '../app/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Создаем пользователя (пароль в открытом виде для пет-проекта)
  const user = await prisma.user.upsert({
    where: { email: 'alexey@example.com' },
    update: {
      password: 'password123',
    },
    create: {
      email: 'alexey@example.com',
      name: 'Алексей Петров',
      password: 'password123',
    },
  });

  console.log('✅ User created:', user.email);

  // Создаем отзывы
  const reviews = await Promise.all([
    prisma.review.create({
      data: {
        title: 'Потрясающая история!',
        body: 'Это аниме полностью изменило мое представление о жанре. Персонажи глубоко проработаны, сюжет захватывающий, анимация на высшем уровне.',
        rating: 5,
        animeTitle: 'Атака Титанов',
        userId: user.id,
      },
    }),
    prisma.review.create({
      data: {
        title: 'Хорошее, но не идеальное',
        body: 'Сериал имеет свои сильные стороны - интересный мир и концепция, но местами сюжет становится предсказуемым.',
        rating: 4,
        animeTitle: 'Наруто',
        userId: user.id,
      },
    }),
    prisma.review.create({
      data: {
        title: 'Шедевр анимации',
        body: 'Визуальная составляющая просто потрясающая. Каждый кадр как произведение искусства.',
        rating: 5,
        animeTitle: 'Призрак в доспехах',
        userId: user.id,
      },
    }),
  ]);

  console.log('✅ Reviews created:', reviews.length);

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
