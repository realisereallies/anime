import { PrismaClient } from '../app/generated/prisma';

const prisma = new PrismaClient();

async function checkFavorites() {
  console.log('❤️ Checking favorites...\n');

  try {
    const favorites = await prisma.favorite.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    console.log('📚 Favorites:');
    favorites.forEach(fav => {
      console.log(`  - ${fav.animeTitle} (by ${fav.user.name || fav.user.email})`);
    });

    console.log(`\n📊 Total favorites: ${favorites.length}`);

    // Проверяем уникальные аниме в избранном
    const uniqueAnime = await prisma.favorite.groupBy({
      by: ['animeTitle'],
      _count: {
        animeTitle: true
      }
    });

    console.log(`📈 Unique anime in favorites: ${uniqueAnime.length}`);

  } catch (error) {
    console.error('❌ Error checking favorites:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkFavorites();
