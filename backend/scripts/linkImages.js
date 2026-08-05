import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

const CATEGORIES = [
  { url: 'https://foxersport.com/index.php?route=product/category&path=100' },
  { url: 'https://foxersport.com/index.php?route=product/category&path=100_101' },
  { url: 'https://foxersport.com/index.php?route=product/category&path=100_102' },
  { url: 'https://foxersport.com/index.php?route=product/category&path=96' },
  { url: 'https://foxersport.com/index.php?route=product/category&path=106' },
  { url: 'https://foxersport.com/index.php?route=product/category&path=105' },
  { url: 'https://foxersport.com/index.php?route=product/category&path=95' },
  { url: 'https://foxersport.com/index.php?route=product/category&path=93' },
  { url: 'https://foxersport.com/index.php?route=product/category&path=101' },
  { url: 'https://foxersport.com/index.php?route=product/category&path=102' }
];

function cleanText(str) {
  if (!str) return '';
  return str.replace(/\s+/g, ' ').trim();
}

async function linkImages() {
  console.log('Loading local webp files...');
  const webpFiles = fs.readdirSync(path.join(__dirname, '..', 'public', 'uploads'))
                      .filter(f => f.endsWith('.webp'));
  
  console.log(`Found ${webpFiles.length} webp files.`);

  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  let updatedCount = 0;
  const processedSlugs = new Set();

  for (const cat of CATEGORIES) {
    let currentPage = 1;
    let hasNextPage = true;

    while (hasNextPage) {
      const pageUrl = `${cat.url}&page=${currentPage}`;
      console.log(`Navigating to ${pageUrl}`);
      try {
        await page.goto(pageUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
      } catch (err) {
        break;
      }
      
      const content = await page.content();
      const $ = cheerio.load(content);
      const productLinks = [];
      $('.product-layout .image a, .product-thumb .image a').each((i, el) => {
        productLinks.push($(el).attr('href'));
      });
      const uniqueLinks = [...new Set(productLinks)].filter(l => l);

      if (uniqueLinks.length === 0) break;

      for (const productUrl of uniqueLinks) {
        try {
          await page.goto(productUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
          const pContent = await page.content();
          const p$ = cheerio.load(pContent);

          let title = cleanText(p$('h1').first().text());
          if (!title) title = cleanText(p$('.breadcrumb li:last-child').text());
          if (!title) title = cleanText(p$('title').text());
          if (!title) continue;

          let slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
          
          if (processedSlugs.has(slug)) continue;
          processedSlugs.add(slug);

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

          // Match imageUrls to webp files
          const matchedWebps = [];
          for (const imgUrl of imageUrls) {
            try {
              const urlPath = new URL(imgUrl).pathname;
              const originalName = path.basename(urlPath).replace(/\.[^.]+$/, '');
              const safeName = originalName.replace(/[^a-zA-Z0-9_-]/g, '-').substring(0, 40);
              
              // Find matching webp file ending with safeName.webp
              const match = webpFiles.find(f => f.includes(safeName) || safeName.includes(f.split('-').slice(3).join('-').replace('.webp','')));
              if (match && !matchedWebps.includes(match)) {
                matchedWebps.push(match);
              }
            } catch(e) {}
          }

          if (matchedWebps.length > 0) {
            const product = await prisma.product.findUnique({ where: { slug } });
            if (product) {
              await prisma.productImage.deleteMany({ where: { productId: product.id } });
              let sortOrder = 1;
              for (const webp of matchedWebps) {
                await prisma.productImage.create({
                  data: {
                    productId: product.id,
                    url: `/uploads/${webp}`,
                    isPrimary: sortOrder === 1,
                    sortOrder: sortOrder++
                  }
                });
              }
              console.log(`[+] Updated ${title} with ${matchedWebps.length} real photos!`);
              updatedCount++;
            }
          }

        } catch (err) {}
      }

      const nextLink = $('.pagination li.active + li a').attr('href');
      if (nextLink) currentPage++;
      else hasNextPage = false;
    }
  }

  await browser.close();
  await prisma.$disconnect();
  console.log(`\n\nImage linking complete! Updated ${updatedCount} products with real photos.`);
}

linkImages().catch(console.error);
