import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';
import http from 'http';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const prisma = new PrismaClient();

const UPLOADS_DIR = path.join(__dirname, '../public', 'uploads');

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      if (res.statusCode === 200) {
        res.pipe(fs.createWriteStream(filepath))
           .on('error', reject)
           .once('close', () => resolve(filepath));
      } else {
        res.resume();
        reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));
      }
    }).on('error', reject);
  });
};

async function scrapeImagesAndAssign() {
  const pages = [
    'https://www.unixpadel.com/fr/',
    'https://www.unixpadel.com/fr/about-us/',
    'https://www.unixpadel.com/fr/our-courts/'
  ];
  
  const imageUrls = new Set();
  
  for (const pageUrl of pages) {
    console.log(`Fetching ${pageUrl}...`);
    try {
      const response = await fetch(pageUrl);
      const html = await response.text();
      
      const imgRegex = /<img[^>]+src="([^">]+)"/g;
      let match;
      
      while ((match = imgRegex.exec(html)) !== null) {
        let src = match[1];
        if (src.startsWith('/')) {
          src = 'https://www.unixpadel.com' + src;
        }
        if (src.match(/\.(jpeg|jpg|png|webp)/i) && !src.includes('logo') && !src.includes('icon') && !src.includes('svg') && !src.includes('dummy')) {
          imageUrls.add(src);
        }
      }
    } catch (e) {
      console.log(`Failed to fetch ${pageUrl}`);
    }
  }

  const imagesList = Array.from(imageUrls);
  console.log(`Found ${imagesList.length} potential images.`);

  const posts = await prisma.blogPost.findMany({
    include: { translations: true }
  });

  // Assign specific images to specific posts based on title keywords or just unique ones
  // We have 6 posts. We just need 6 unique images from the list.
  
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    
    // Pick an image intelligently if possible, or just uniquely
    let imgUrl;
    const title = post.translations[0]?.title.toLowerCase() || '';
    
    if (title.includes('college')) {
      imgUrl = imagesList.find(url => url.includes('court') || url.includes('panoramic')) || imagesList[i];
    } else if (title.includes('business')) {
      imgUrl = imagesList.find(url => url.includes('office') || url.includes('standart')) || imagesList[i + 1];
    } else if (title.includes('rumi')) {
      imgUrl = imagesList.find(url => url.includes('view') || url.includes('single')) || imagesList[i + 2];
    } else if (title.includes('fair')) {
      imgUrl = imagesList.find(url => url.includes('friend') || url.includes('team') || url.includes('court')) || imagesList[i + 3];
    } else if (title.includes('kids') || title.includes('enfant')) {
      imgUrl = imagesList.find(url => url.includes('kid') || url.includes('mini')) || imagesList[i + 4];
    } else {
      imgUrl = imagesList[i + 5] || imagesList[i];
    }
    
    // Ensure we don't crash if imgUrl is undefined
    imgUrl = imgUrl || imagesList[i % imagesList.length];

    const filename = `blog-img-${post.id.substring(0, 8)}-${path.basename(imgUrl)}`;
    const filepath = path.join(UPLOADS_DIR, filename);
    
    try {
      console.log(`Downloading ${imgUrl} for post ${post.slug}...`);
      await downloadImage(imgUrl, filepath);
      
      const dbUrl = `/uploads/${filename}`;
      await prisma.blogPost.update({
        where: { id: post.id },
        data: { featuredImage: dbUrl }
      });
      console.log(`✅ Assigned ${dbUrl} to ${post.slug}`);
    } catch (err) {
      console.error(`❌ Failed to download/assign image for ${post.slug}:`, err.message);
    }
  }
}

scrapeImagesAndAssign()
  .then(() => console.log('Finished updating blog images!'))
  .catch(console.error)
  .finally(() => prisma.$disconnect());
