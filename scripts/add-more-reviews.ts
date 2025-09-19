import { PrismaClient } from '../app/generated/prisma';

const prisma = new PrismaClient();

async function addMoreReviews() {
  try {
    console.log('📝 Добавляем больше отзывов...');
    
    // Получаем существующего пользователя
    const user = await prisma.user.findFirst();
    if (!user) {
      console.log('❌ Пользователь не найден');
      return;
    }

    const reviews = [
      {
        title: 'Эпическая сага о дружбе',
        body: 'Невероятная история о дружбе, преданности и самопожертвовании. Персонажи настолько живые, что кажется, будто ты знаешь их лично. Анимация потрясающая, особенно боевые сцены.',
        rating: 5,
        animeTitle: 'One Piece'
      },
      {
        title: 'Философская глубина',
        body: 'Это не просто аниме, а целая философия. Каждый эпизод заставляет задуматься о смысле жизни, смерти и человеческой природе. Визуальный стиль уникальный.',
        rating: 5,
        animeTitle: 'Евангелион'
      },
      {
        title: 'Смех сквозь слезы',
        body: 'Потрясающая комедия с элементами драмы. Персонажи харизматичные, сюжет непредсказуемый. Отлично поднимает настроение после тяжелого дня.',
        rating: 4,
        animeTitle: 'Gintama'
      },
      {
        title: 'Современная классика',
        body: 'Отличное сочетание экшена, драмы и романтики. Персонажи хорошо проработаны, сюжет держит в напряжении до самого конца.',
        rating: 4,
        animeTitle: 'Demon Slayer'
      },
      {
        title: 'Психологический триллер',
        body: 'Захватывающая история с множеством поворотов. Каждый эпизод добавляет новые загадки. Рекомендую всем любителям детективов.',
        rating: 5,
        animeTitle: 'Death Note'
      },
      {
        title: 'Душевная история',
        body: 'Трогательная история о взрослении и поиске себя. Анимация красивая, музыка запоминающаяся. Оставляет теплые чувства.',
        rating: 4,
        animeTitle: 'Your Name'
      },
      {
        title: 'Научная фантастика',
        body: 'Отличный пример качественной научной фантастики. Мир проработан до мелочей, технологии выглядят реалистично.',
        rating: 4,
        animeTitle: 'Steins;Gate'
      },
      {
        title: 'Боевые искусства',
        body: 'Классика жанра боевых искусств. Персонажи сильные, бои зрелищные. Хотя местами предсказуемо, но очень увлекательно.',
        rating: 3,
        animeTitle: 'Dragon Ball Z'
      }
    ];

    for (const reviewData of reviews) {
      await prisma.review.create({
        data: {
          ...reviewData,
          userId: user.id
        }
      });
    }

    console.log(`✅ Добавлено ${reviews.length} новых отзывов`);
    
    const totalReviews = await prisma.review.count();
    console.log(`📊 Всего отзывов в базе: ${totalReviews}`);
    
  } catch (error) {
    console.error('❌ Ошибка при добавлении отзывов:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addMoreReviews();
