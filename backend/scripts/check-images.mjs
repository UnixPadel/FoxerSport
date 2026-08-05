import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  const images = await prisma.productImage.findMany({ take: 3 });
  console.log(images);
}
check().finally(() => prisma.$disconnect());
