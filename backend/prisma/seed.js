import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding categories...');

  // 1. Clothing
  const catClothing = await prisma.category.upsert({
    where: { slug: 'clothing' },
    update: {},
    create: {
      slug: 'clothing',
      translations: {
        create: [
          { locale: 'en', name: 'Clothing' },
          { locale: 'tr', name: 'GİYİM' }
        ]
      },
      children: {
        create: [
          {
            slug: 'clothing-men',
            translations: { create: [{ locale: 'en', name: 'Men' }, { locale: 'tr', name: 'ERKEK' }] }
          },
          {
            slug: 'clothing-women',
            translations: { create: [{ locale: 'en', name: 'Women' }, { locale: 'tr', name: 'KADIN' }] }
          }
        ]
      }
    }
  });

  // 2. Rackets
  const catRackets = await prisma.category.upsert({
    where: { slug: 'rackets' },
    update: {},
    create: {
      slug: 'rackets',
      translations: {
        create: [
          { locale: 'en', name: 'Rackets' },
          { locale: 'tr', name: 'RAKETLER' }
        ]
      },
      children: {
        create: [
          {
            slug: 'rackets-tennis',
            translations: { create: [{ locale: 'en', name: 'Tennis' }, { locale: 'tr', name: 'Tenis' }] }
          },
          {
            slug: 'rackets-padel',
            translations: { create: [{ locale: 'en', name: 'Padel' }, { locale: 'tr', name: 'Padel' }] }
          }
        ]
      }
    }
  });

  // 3. Accessories
  await prisma.category.upsert({
    where: { slug: 'accessories' },
    update: {},
    create: {
      slug: 'accessories',
      translations: { create: [{ locale: 'en', name: 'Accessories' }, { locale: 'tr', name: 'AKSESUARLAR' }] },
      children: {
        create: [
          { slug: 'grips', translations: { create: [{ locale: 'en', name: 'Grips' }, { locale: 'tr', name: 'Grip' }] } },
          { slug: 'balls', translations: { create: [{ locale: 'en', name: 'Balls' }, { locale: 'tr', name: 'Toplar' }] } }
        ]
      }
    }
  });

  // 4. Shoes
  await prisma.category.upsert({
    where: { slug: 'shoes' },
    update: {},
    create: {
      slug: 'shoes',
      translations: { create: [{ locale: 'en', name: 'Shoes' }, { locale: 'tr', name: 'AYAKKABI' }] },
      children: {
        create: [
          { slug: 'shoes-men', translations: { create: [{ locale: 'en', name: 'Men' }, { locale: 'tr', name: 'Erkek' }] } },
          { slug: 'shoes-women', translations: { create: [{ locale: 'en', name: 'Women' }, { locale: 'tr', name: 'Kadın' }] } }
        ]
      }
    }
  });

  // 5. Training Equipment
  await prisma.category.upsert({
    where: { slug: 'training-equipment' },
    update: {},
    create: {
      slug: 'training-equipment',
      translations: { create: [{ locale: 'en', name: 'Training Equipment' }, { locale: 'tr', name: 'EKİPMANLAR' }] },
      children: {
        create: [
          { slug: 'nets', translations: { create: [{ locale: 'en', name: 'Nets' }, { locale: 'tr', name: 'File' }] } },
          { slug: 'cones', translations: { create: [{ locale: 'en', name: 'Cones' }, { locale: 'tr', name: 'Koni' }] } }
        ]
      }
    }
  });

  // 6. Bags
  await prisma.category.upsert({
    where: { slug: 'bags' },
    update: {},
    create: {
      slug: 'bags',
      translations: { create: [{ locale: 'en', name: 'Bags' }, { locale: 'tr', name: 'ÇANTALAR' }] },
      children: {
        create: [
          { slug: 'racket-bags', translations: { create: [{ locale: 'en', name: 'Racket bags' }, { locale: 'tr', name: 'Raket Çantası' }] } },
          { slug: 'sport-bags', translations: { create: [{ locale: 'en', name: 'Sport bags' }, { locale: 'tr', name: 'Spor Çantası' }] } }
        ]
      }
    }
  });

  console.log('Categories seeded successfully!');

  console.log('Seeding products...');

  // --- RACKETS ---
  const racketCat = await prisma.category.findUnique({ where: { slug: 'rackets-padel' } });
  
  if (racketCat) {
    // Product 1: Foxer 18K
    await prisma.product.upsert({
      where: { slug: 'foxer-18k-padel-raketi-fw-4040' },
      update: {},
      create: {
        categoryId: racketCat.id,
        sku: 'FW-4040',
        slug: 'foxer-18k-padel-raketi-fw-4040',
        priceTry: 8700.00,
        compareAtPriceTry: 10500.00,
        stockQuantity: 50,
        weightGrams: 365,
        avgRating: 5.0,
        reviewCount: 12,
        brand: 'Foxer',
        translations: {
          create: [
            {
              locale: 'tr',
              name: 'Foxer 18K Padel Raketi FW-4040',
              shortDescription: 'Sahaya hükmetmek için tasarlandı. 18K karbon yüzeyi ve Black EVA çekirdeği ile maksimum güç ve kontrol parmaklarınızın ucunda.',
              description: 'Foxersport 18K Carbon Padel Raketi, agresif hücum oyuncuları için tasarlanmış profesyonel serimizin amiral gemisidir. 18K karbon fiber yüzeyi sayesinde topla temas anında maksimum güç ve anında tepki verir.'
            },
            {
              locale: 'en',
              name: 'Foxer 18K Padel Racket FW-4040',
              shortDescription: 'Designed to dominate the court. 18K carbon surface and Black EVA core bring maximum power and control to your fingertips.',
              description: 'The Foxersport 18K Carbon Padel Racket is the flagship of our professional series designed for aggressive attacking players.'
            }
          ]
        },
        images: {
          create: [
            { url: 'https://foxersport.com/image/cache/catalog/Gemini_Generated_Image_qee7vlqee7vlqee7-370x370.png', isPrimary: true, sortOrder: 1 },
            { url: 'https://foxersport.com/image/cache/catalog/Gemini_Generated_Image_gbdkp3gbdkp3gbdk-370x370.png', isPrimary: false, sortOrder: 2 },
            { url: 'https://foxersport.com/image/cache/catalog/Product/Racket/12K%20FW-4027/4R1A9884-370x370.JPG', isPrimary: false, sortOrder: 3 }
          ]
        },
        variants: {
          create: [
            { sku: 'FW-4040-360', size: '360g', stockQuantity: 10 },
            { sku: 'FW-4040-365', size: '365g', stockQuantity: 20 },
            { sku: 'FW-4040-370', size: '370g', stockQuantity: 15 },
            { sku: 'FW-4040-375', size: '375g', stockQuantity: 5 }
          ]
        }
      }
    });

    // Product 2: Foxer 12K
    await prisma.product.upsert({
      where: { slug: 'foxer-12k-padel-racket-fx-4027' },
      update: {},
      create: {
        categoryId: racketCat.id,
        sku: 'FX-4027',
        slug: 'foxer-12k-padel-racket-fx-4027',
        priceTry: 6246.00,
        stockQuantity: 30,
        weightGrams: 360,
        avgRating: 4.8,
        reviewCount: 8,
        brand: 'Foxer',
        translations: {
          create: [
            {
              locale: 'tr',
              name: 'Foxer 12K Padel Raketi FX-4027',
              shortDescription: 'Mükemmel denge ve kontrol. 12K karbon yapısı ile çok yönlü oyuncular için ideal.'
            },
            {
              locale: 'en',
              name: 'Foxer 12K Padel Racket FX-4027',
              shortDescription: 'Perfect balance and control. Ideal for versatile players with its 12K carbon structure.'
            }
          ]
        },
        images: {
          create: [
            { url: 'https://foxersport.com/image/cache/catalog/Product/Racket/12K%20FW-4027/4R1A9884-370x370.JPG', isPrimary: true, sortOrder: 1 },
            { url: 'https://foxersport.com/image/cache/catalog/Product/Racket/12K%20FW-4027/4R1A9885-370x370.JPG', isPrimary: false, sortOrder: 2 }
          ]
        }
      }
    });

    // Product 3: Foxer 3K
    await prisma.product.upsert({
      where: { slug: 'foxer-3k-padel-racket-fw-4042' },
      update: {},
      create: {
        categoryId: racketCat.id,
        sku: 'FW-4042',
        slug: 'foxer-3k-padel-racket-fw-4042',
        priceTry: 8783.00,
        stockQuantity: 40,
        weightGrams: 355,
        avgRating: 4.5,
        reviewCount: 5,
        brand: 'Foxer',
        translations: {
          create: [
            {
              locale: 'tr',
              name: 'Foxer 3K Padel Raketi FW-4042',
              shortDescription: 'Hız ve manevra kabiliyeti arayanlar için tasarlandı. 3K karbon fiber ile inanılmaz hafif.'
            },
            {
              locale: 'en',
              name: 'Foxer 3K Padel Racket FW-4042',
              shortDescription: 'Designed for those seeking speed and maneuverability. Incredibly light with 3K carbon fiber.'
            }
          ]
        },
        images: {
          create: [
            { url: 'https://foxersport.com/image/cache/catalog/Product/Racket/3K%20BW-4042/4R1A9875-370x370.JPG', isPrimary: true, sortOrder: 1 },
            { url: 'https://foxersport.com/image/cache/catalog/Product/Racket/3K%20BW-4042/4R1A9878-370x370.JPG', isPrimary: false, sortOrder: 2 }
          ]
        }
      }
    });
  }

  // --- CLOTHING ---
  const clothesCat = await prisma.category.findUnique({ where: { slug: 'clothing-men' } });
  if (clothesCat) {
    await prisma.product.upsert({
      where: { slug: 'foxer-pro-padel-tshirt' },
      update: {},
      create: {
        categoryId: clothesCat.id,
        sku: 'CL-1001',
        slug: 'foxer-pro-padel-tshirt',
        priceTry: 850.00,
        stockQuantity: 100,
        avgRating: 5.0,
        reviewCount: 22,
        brand: 'Foxer',
        translations: {
          create: [
            {
              locale: 'tr',
              name: 'Foxer Pro Performans Tişört',
              shortDescription: 'Teri dışarı atan özel kumaşıyla maç boyunca kuru kalın.'
            },
            {
              locale: 'en',
              name: 'Foxer Pro Performance T-Shirt',
              shortDescription: 'Stay dry throughout the match with its special sweat-wicking fabric.'
            }
          ]
        },
        images: {
          create: [
            { url: 'https://foxersport.com/image/cache/catalog/clothing-994x540.png', isPrimary: true, sortOrder: 1 }
          ]
        },
        variants: {
          create: [
            { sku: 'CL-1001-S', size: 'S', stockQuantity: 20 },
            { sku: 'CL-1001-M', size: 'M', stockQuantity: 30 },
            { sku: 'CL-1001-L', size: 'L', stockQuantity: 30 },
            { sku: 'CL-1001-XL', size: 'XL', stockQuantity: 20 }
          ]
        }
      }
    });
  }

  console.log('Products seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
