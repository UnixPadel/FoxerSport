import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.updateMany({
    where: { email: 'halim@foxersport.com' },
    data: { email: 'halim_old@foxersport.com' }
  });
  console.log('Email renamed');
}

main().finally(() => prisma.$disconnect());
