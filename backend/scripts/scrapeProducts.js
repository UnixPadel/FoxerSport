import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.join(__dirname, '..', 'public', 'uploads', 'products');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const prisma = new PrismaClient();

const CATEGORIES = [
  { url: 'https://foxersport.com/index.php?route=product/category&path=100', slug: 'clothing' },
  { url: 'https://foxersport.com/index.php?route=product/category&path=100_101', slug: 'clothing-women' },
  { url: 'https://foxersport.com/index.php?route=product/category&path=100_102', slug: 'clothing-men' },
  { url: 'https://foxersport.com/index.php?route=product/category&path=96', slug: 'rackets' },
  { url: 'https://foxersport.com/index.php?route=product/category&path=106', slug: 'accessories' },
  { url: 'https://foxersport.com/index.php?route=product/category&path=105', slug: 'shoes' },
  { url: 'https://foxersport.com/index.php?route=product/category&path=95', slug: 'training-equipment' },
  { url: 'https://foxersport.com/index.php?route=product/category&path=93', slug: 'bags' },
  { url: 'https://foxersport.com/index.php?route=product/category&path=101', slug: 'category-101' },
  { url: 'https://foxersport.com/index.php?route=product/category&path=102', slug: 'category-102' }
];

async function downloadImage(url, filename) {
  if (!url) return null;
  if (url.startsWith('/')) {
    url = 'https://foxersport.com' + url;
  }
  const filepath = path.join(UPLOADS_DIR, filename);
  if (fs.existsSync(filepath)) {
    return `/uploads/products/${filename}`;
  }
  
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
      timeout: 10000
    });
    const writer = fs.createWriteStream(filepath);
    response.data.pipe(writer);
    
    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve(`/uploads/products/${filename}`));
      writer.on('error', reject);
    });
  } catch (err) {
    console.error(`  [!] Failed to download image ${url}:`, err.message);
    return null;
  }
}

function cleanText(str) {
  if (!str) return '';
  return str.replace(/\s+/g, ' ').trim();
}

function parsePrice(text) {
  if (!text) return 0;
  let str = text.replace(/[^\d.,]/g, '');
  if (str.includes(',') && str.includes('.')) {
     if (str.lastIndexOf(',') > str.lastIndexOf('.')) {
        str = str.replace(/\./g, '').replace(',', '.');
     } else {
        str = str.replace(/,/g, '');
     }
  } else if (str.includes(',')) {
     str = str.replace(',', '.');
  } else if (str.includes('.')) {
     const parts = str.split('.');
     if (parts[1] && parts[1].length === 3) {
         str = str.replace('.', '');
     }
  }
  return parseFloat(str) || 0;
}

async function scrape() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  let totalImported = 0;

  for (const cat of CATEGORIES) {
    console.log(`\n\n=== Scraping Category: ${cat.slug} ===`);
    
    let dbCategory = await prisma.category.findUnique({
      where: { slug: cat.slug }
    });
    
    if (!dbCategory) {
      console.log(`Category ${cat.slug} not found in local DB. Creating it.`);
      dbCategory = await prisma.category.create({
        data: {
          slug: cat.slug,
          translations: {
            create: [
              { locale: 'tr', name: cat.slug },
              { locale: 'en', name: cat.slug }
            ]
          }
        }
      });
    }

    let currentPage = 1;
    let hasNextPage = true;

    while (hasNextPage) {
      const pageUrl = `${cat.url}&page=${currentPage}`;
      console.log(`Navigating to ${pageUrl}`);
      
      try {
        await page.goto(pageUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
      } catch (err) {
        console.error(`Failed to navigate to ${pageUrl}`);
        break;
      }
      
      const content = await page.content();
      const $ = cheerio.load(content);
      
      const productLinks = [];
      $('.product-layout .image a, .product-thumb .image a').each((i, el) => {
        productLinks.push($(el).attr('href'));
      });

      const uniqueLinks = [...new Set(productLinks)].filter(l => l);

      if (uniqueLinks.length === 0) {
        console.log(`No products found on page ${currentPage}. Moving to next category.`);
        break;
      }

      console.log(`Found ${uniqueLinks.length} products on page ${currentPage}`);

      for (const productUrl of uniqueLinks) {
        try {
          await page.goto(productUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
          const pContent = await page.content();
          const p$ = cheerio.load(pContent);

          let title = cleanText(p$('h1').first().text());
          if (!title) {
            title = cleanText(p$('.breadcrumb li:last-child').text());
          }
          if (!title) {
            title = cleanText(p$('title').text());
          }
          if (!title) {
            console.log('  -> No title found, skipping.');
            continue;
          }

          let slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
          if (!slug) slug = 'product-' + Math.floor(Math.random()*10000);

          // If product exists, append random suffix to avoid error if title overlaps but it's different product
          let existingProduct = await prisma.product.findUnique({ where: { slug } });
          if (existingProduct) {
             console.log(`  -> Product ${slug} already exists. Skipping.`);
             continue;
          }

          const descriptionHtml = p$('#tab-description').html() || '';
          let shortDescription = cleanText(p$('#tab-description').text());
          if (shortDescription.length > 150) shortDescription = shortDescription.substring(0, 150) + '...';

          let priceTry = 0;
          let compareAtPriceTry = null;
          
          const newPriceText = p$('.price-new').first().text();
          const oldPriceText = p$('.price-old').first().text();
          const fallbackPrice = p$('ul.list-unstyled h2').first().text() || p$('.price').first().text();

          if (newPriceText && oldPriceText) {
             priceTry = parsePrice(newPriceText);
             compareAtPriceTry = parsePrice(oldPriceText);
          } else if (fallbackPrice) {
             priceTry = parsePrice(fallbackPrice);
          }

          if (isNaN(priceTry) || priceTry <= 0) priceTry = 99.99;

          const priceUsd = parseFloat((priceTry / 33).toFixed(2));
          const priceEur = parseFloat((priceTry / 35).toFixed(2));

          const imageUrls = [];
          p$('.product_image a').each((i, el) => {
             const href = p$(el).attr('href');
             if (href && !href.startsWith('#')) imageUrls.push(href);
          });
          if (imageUrls.length === 0) {
             p$('.product_image img').each((i, el) => {
                const src = p$(el).attr('src');
                if (src) imageUrls.push(src);
             });
          }
          if (imageUrls.length === 0) {
             const mainImg = p$('.thumbnail img').attr('src');
             if (mainImg) imageUrls.push(mainImg);
          }

          const localImages = [];
          for (let i = 0; i < imageUrls.length; i++) {
             const imgUrl = imageUrls[i];
             const ext = path.extname(imgUrl.split('?')[0]) || '.jpg';
             const filename = `${slug}-${i}${ext}`;
             const localPath = await downloadImage(imgUrl, filename);
             if (localPath) localImages.push({ url: localPath, isPrimary: i === 0, sortOrder: i });
          }

          const newProduct = await prisma.product.create({
            data: {
              categoryId: dbCategory.id,
              slug,
              sku: `FXR-${Math.floor(Math.random() * 900000) + 100000}`,
              priceTry,
              compareAtPriceTry,
              priceUsd,
              priceEur,
              stockQuantity: 100,
              images: {
                create: localImages
              },
              translations: {
                create: [
                  { locale: 'tr', name: title, description: descriptionHtml, shortDescription },
                  { locale: 'en', name: title, description: descriptionHtml, shortDescription }
                ]
              },
              variants: {
                create: [
                  { sku: `${slug.substring(0, 40)}-S`, size: 'S', stockQuantity: 20, priceModifierEur: 0, priceModifierUsd: 0 },
                  { sku: `${slug.substring(0, 40)}-M`, size: 'M', stockQuantity: 20, priceModifierEur: 0, priceModifierUsd: 0 },
                  { sku: `${slug.substring(0, 40)}-L`, size: 'L', stockQuantity: 20, priceModifierEur: 0, priceModifierUsd: 0 }
                ]
              }
            }
          });

          console.log(`  [+] Created: ${title} (${priceTry}₺)`);
          totalImported++;

        } catch (err) {
          console.error(`  [!] Error scraping ${productUrl}:`, err.message);
        }
      }

      const nextLink = $('.pagination li.active + li a').attr('href');
      if (nextLink) {
        currentPage++;
      } else {
        hasNextPage = false;
      }
    }
  }

  await browser.close();
  await prisma.$disconnect();
  console.log(`\n\nScraping complete! Imported ${totalImported} products.`);
}

scrape().catch(err => {
  console.error(err);
  prisma.$disconnect();
  process.exit(1);
});
