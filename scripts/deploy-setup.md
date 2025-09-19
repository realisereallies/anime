# Инструкция по деплою на Vercel

## 1. Подготовка к деплою

### Установка зависимостей
```bash
npm install @vercel/postgres
```

### Обновление package.json
Добавить в scripts:
```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate deploy"
  }
}
```

## 2. Настройка Vercel

### В Vercel Dashboard:
1. Создать новый проект
2. Подключить GitHub репозиторий
3. В настройках проекта добавить переменные окружения:

**Environment Variables:**
- `DATABASE_URL` - будет автоматически создана при подключении Vercel Postgres
- `JWT_SECRET` - сгенерировать сложный секретный ключ
- `NEXTAUTH_URL` - URL вашего сайта (например: https://your-app.vercel.app)

### Подключение Vercel Postgres:
1. В Vercel Dashboard → Storage → Create Database → Postgres
2. Выбрать план (Hobby - бесплатный)
3. Создать базу данных
4. Vercel автоматически добавит `DATABASE_URL` в переменные окружения

## 3. Миграции базы данных

### После деплоя:
1. В Vercel Dashboard → Functions → View Function Logs
2. Или через Vercel CLI:
```bash
npx vercel env pull .env.local
npx prisma migrate deploy
```

## 4. Альтернативные варианты БД

### PlanetScale (MySQL):
```bash
npm install @planetscale/database
```

### Neon (PostgreSQL):
```bash
npm install @neondatabase/serverless
```

## 5. Проверка деплоя

После деплоя проверить:
- [ ] Регистрация пользователей работает
- [ ] Логин работает
- [ ] Отображение данных корректно
- [ ] JWT токены работают
