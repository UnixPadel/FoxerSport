import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';
import http from 'http';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const prisma = new PrismaClient();

const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Function to download an image
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
  console.log("Fetching images from unixpadel.com...");
  
  // Fetching the news page to get some good images
  const response = await fetch('https://www.unixpadel.com/fr/');
  const html = await response.text();
  
  // Extract img tags
  const imgRegex = /<img[^>]+src="([^">]+)"/g;
  let match;
  const imageUrls = new Set();
  
  while ((match = imgRegex.exec(html)) !== null) {
    let src = match[1];
    if (src.startsWith('/')) {
      src = 'https://www.unixpadel.com' + src;
    }
    // Filter out logos, svgs, and small icons
    if (src.match(/\.(jpeg|jpg|png|webp)/i) && !src.includes('logo') && !src.includes('icon') && !src.includes('svg')) {
      imageUrls.add(src);
    }
  }

  const imagesList = Array.from(imageUrls);
  console.log(`Found ${imagesList.length} potential images.`);
  
  if (imagesList.length === 0) {
    console.log("No images found!");
    return;
  }

  // Get all unique blog posts
  const posts = await prisma.blogPost.findMany({
    include: { translations: true }
  });

  console.log(`Found ${posts.length} blog posts to update.`);

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    // Select an image (loop through available images if there are fewer images than posts)
    const imgUrl = imagesList[i % imagesList.length];
    
    const filename = `blog-img-${post.id.substring(0, 8)}-${path.basename(imgUrl)}`;
    const filepath = path.join(UPLOADS_DIR, filename);
    
    try {
      console.log(`Downloading ${imgUrl} for post ${post.slug}...`);
      await downloadImage(imgUrl, filepath);
      
      // Update DB
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
