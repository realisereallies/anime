import { PrismaClient } from '../app/generated/prisma';

const prisma = new PrismaClient();

async function addFavorites() {
  console.log('❤️ Adding favorite anime...\n');

  try {
    // Находим пользователя Liza
    const user = await prisma.user.findUnique({
      where: { email: 'dav.liza@mail.ru' }
    });

    if (!user) {
      console.log('❌ User not found');
      return;
    }

    // Добавляем избранные аниме
    const favorites = await Promise.all([
      prisma.favorite.create({
        data: {
          animeTitle: 'Атака Титанов',
          posterUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=150&h=200&fit=crop',
          userId: user.id
        }
      }),
      prisma.favorite.create({
        data: {
          animeTitle: 'Наруто',
          posterUrl: 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=150&h=200&fit=crop',
          userId: user.id
        }
      }),
      prisma.favorite.create({
        data: {
          animeTitle: 'One Piece',
          posterUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=150&h=200&fit=crop',
          userId: user.id
        }
      })
    ]);

    console.log('✅ Added favorites:');
    favorites.forEach(fav => {
      console.log(`  - ${fav.animeTitle}`);
    });

    // Проверяем общее количество
    const totalFavorites = await prisma.favorite.count({
      where: { userId: user.id }
    });
    console.log(`\n📊 Total favorites for ${user.name}: ${totalFavorites}`);

  } catch (error) {
    console.error('❌ Error adding favorites:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addFavorites();
