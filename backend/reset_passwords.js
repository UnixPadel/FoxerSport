import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function resetPasswords() {
  const hash = await bcrypt.hash('password123', 10);
  await prisma.user.updateMany({
    data: { passwordHash: hash }
  });
  console.log('All passwords reset to password123');
  await prisma.$disconnect();
}

resetPasswords();
