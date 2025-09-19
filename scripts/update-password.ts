import { PrismaClient } from '../app/generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function updatePassword() {
  console.log('🔐 Updating password for Liza...\n');

  try {
    // Хешируем новый пароль
    const hashedPassword = await bcrypt.hash('liza123', 10);

    // Обновляем пароль для пользователя Liza
    const updatedUser = await prisma.user.update({
      where: { email: 'dav.liza@mail.ru' },
      data: {
        password: hashedPassword
      }
    });

    console.log('✅ Password updated successfully!');
    console.log(`👤 User: ${updatedUser.name} (${updatedUser.email})`);
    console.log('🔑 New password: liza123');

  } catch (error) {
    console.error('❌ Error updating password:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updatePassword();
