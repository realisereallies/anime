// Скрипт для настройки продакшн базы данных
const { PrismaClient } = require("../app/generated/prisma");

const prisma = new PrismaClient();

async function setupProduction() {
  try {
    console.log("🚀 Настройка продакшн базы данных...");

    // Проверяем подключение
    await prisma.$connect();
    console.log("✅ Подключение к базе данных успешно");

    // Создаем тестового пользователя
    const testUser = await prisma.user.upsert({
      where: { email: "test@example.com" },
      update: {},
      create: {
        email: "test@example.com",
        name: "Тестовый пользователь",
        password: "test123",
      },
    });

    console.log("✅ Тестовый пользователь создан:", testUser.name);

    // Создаем тестовый отзыв
    const testReview = await prisma.review.upsert({
      where: { id: "test-review-1" },
      update: {},
      create: {
        id: "test-review-1",
        title: "Добро пожаловать!",
        body: "Это тестовый отзыв для проверки работы сайта. Регистрируйтесь и добавляйте свои отзывы!",
        rating: 5,
        animeTitle: "Добро пожаловать в мир аниме",
        userId: testUser.id,
      },
    });

    console.log("✅ Тестовый отзыв создан:", testReview.title);

    console.log("🎉 Настройка завершена успешно!");
  } catch (error) {
    console.error("❌ Ошибка при настройке:", error);
  } finally {
    await prisma.$disconnect();
  }
}

setupProduction();
