import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_DIR = path.join(__dirname, '../src');
const PUBLIC_IMG_DIR = path.join(__dirname, '../public/images');

if (!fs.existsSync(PUBLIC_IMG_DIR)) {
  fs.mkdirSync(PUBLIC_IMG_DIR, { recursive: true });
}

// Helper to recursively get all files
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if (file.endsWith('.vue') || file.endsWith('.js')) {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });

  return arrayOfFiles;
}

const urlRegex = /https:\/\/foxersport\.com\/image\/([^"'\s\)]+)/g;

async function migrateFrontendImages() {
  const files = getAllFiles(SRC_DIR);
  let totalReplaced = 0;
  let downloadedCount = 0;

  for (const filePath of files) {
    let content = fs.readFileSync(filePath, 'utf8');
    let matches = [...content.matchAll(urlRegex)];

    if (matches.length > 0) {
      console.log(`Found ${matches.length} URLs in ${path.relative(SRC_DIR, filePath)}`);
      
      for (const match of matches) {
        const fullUrl = match[0];
        const relativePath = match[1]; // e.g. cache/catalog/clothing-994x540.png
        
        // Create a safe filename
        const filename = relativePath.replace(/[^a-zA-Z0-9.-]/g, '_');
        const destPath = path.join(PUBLIC_IMG_DIR, filename);
        const newUrl = `/images/${filename}`;

        // Download if not exists
        if (!fs.existsSync(destPath)) {
          console.log(`  Downloading ${fullUrl} -> ${filename}...`);
          try {
            const response = await fetch(fullUrl);
            if (!response.ok) {
              console.error(`  Failed to fetch ${fullUrl}: ${response.statusText}`);
              continue; // Skip replacement if download fails
            }
            const buffer = Buffer.from(await response.arrayBuffer());
            fs.writeFileSync(destPath, buffer);
            downloadedCount++;
          } catch (err) {
            console.error(`  Error downloading ${fullUrl}:`, err.message);
            continue; // Skip replacement
          }
        }

        // Replace in content
        content = content.replace(fullUrl, newUrl);
        totalReplaced++;
      }

      fs.writeFileSync(filePath, content, 'utf8');
    }
  }

  console.log(`\nMigration complete! Downloaded ${downloadedCount} images, replaced ${totalReplaced} URLs in code.`);
}

migrateFrontendImages();
