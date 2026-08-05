const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function run() {
  const data = fs.readFileSync('restore.txt', 'utf8');
  const blocks = data.split('---').map(b => b.trim()).filter(Boolean);

  for (const block of blocks) {
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) continue;

    const oldName = lines[0];
    const oldImagesRaw = lines[1].split(',').map(u => u.trim());
    
    // Convert old images to proper DB paths
    const oldImages = oldImagesRaw.map(url => {
      if (url.startsWith('http://localhost:3000')) {
        return url.replace('http://localhost:3000', '');
      }
      return url;
    });

    console.log(`Processing: ${oldName}`);

    // Try to find the corresponding scraped product.
    // E.g. "Foxer 18K Padel Raket FX – 5006 – 18K" -> "Foxer 18K Padel Racket FX – 5006 – 18K"
    let searchName = oldName;
    if (oldName.includes('Raketi')) {
      searchName = oldName.replace('Raketi', 'Racket');
    } else if (oldName.includes('Raket')) {
      searchName = oldName.replace('Raket', 'Racket');
    }

    const translations = await prisma.productTranslation.findMany({
      where: { name: searchName },
      include: { product: true }
    });

    if (translations.length === 0) {
      console.log(`  -> Not found corresponding new product for ${searchName}`);
      continue;
    }

    const product = translations[0].product;

    // Delete new images
    await prisma.productImage.deleteMany({
      where: { productId: product.id }
    });

    // Insert old images
    for (const url of oldImages) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: url
        }
      });
    }

    // Rename the product back to its old name (so the user gets exactly what was deleted)
    await prisma.productTranslation.update({
      where: { id: translations[0].id },
      data: { name: oldName }
    });

    console.log(`  -> Restored ${oldImages.length} images and renamed to ${oldName}`);
  }
}

run().catch(console.error).finally(() => prisma.$disconnect());
