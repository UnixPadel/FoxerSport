import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

async function fixUrls() {
  console.log(`Fixing URLs to include BACKEND_URL: ${BACKEND_URL}`);

  const images = await prisma.productImage.findMany({
    where: {
      url: {
        startsWith: '/uploads/'
      }
    }
  });

  console.log(`Found ${images.length} images with relative URLs.`);

  let updated = 0;
  for (const img of images) {
    const newUrl = `${BACKEND_URL}${img.url}`;
    await prisma.productImage.update({
      where: { id: img.id },
      data: { url: newUrl }
    });
    updated++;
  }

  console.log(`Successfully updated ${updated} URLs in the database!`);
}

fixUrls()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
