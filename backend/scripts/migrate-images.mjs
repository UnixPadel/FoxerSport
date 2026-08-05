/**
 * ============================================================
 *  FOXERSPORT — Image Migration Pipeline
 * ============================================================
 *  Ce script télécharge toutes les images stockées avec des
 *  URLs externes (ex: foxersport.com) et les migre localement
 *  dans public/uploads/ en les convertissant en WebP optimisé.
 *  Il met ensuite à jour la base de données avec les nouveaux liens.
 *
 *  Usage: node scripts/migrate-images.mjs
 *  Pré-requis: Node.js >= 18 (fetch natif)
 * ============================================================
 */

import { PrismaClient } from '@prisma/client';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const prisma = new PrismaClient();

// ──────────────────────────────────────────────────────────
// CONFIG
// ──────────────────────────────────────────────────────────
const UPLOADS_DIR = path.join(__dirname, '..', 'public', 'uploads');
const LOCAL_BASE_URL = '/uploads'; // Path exposé par Express

const WEBP_QUALITY = 82;   // Qualité WebP (82% = invisible à l'oeil nu, 4x moins lourd)
const MAX_WIDTH    = 900;  // Largeur max
const MAX_HEIGHT   = 900;  // Hauteur max

// Délai entre les requêtes HTTP (ms) — pour ne pas surcharger l'ancien serveur
const REQUEST_DELAY_MS = 400;

// ──────────────────────────────────────────────────────────
// HELPERS
// ──────────────────────────────────────────────────────────

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Vérifie si une URL est externe (http/https) */
const isExternalUrl = (url) =>
  typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://'));

/** Génère un nom de fichier WebP unique */
const generateFilename = (originalUrl) => {
  try {
    const urlPath = new URL(originalUrl).pathname;
    const originalName = path.basename(urlPath).replace(/\.[^.]+$/, '');
    const safeName = originalName.replace(/[^a-zA-Z0-9_-]/g, '-').substring(0, 40);
    return `product-${Date.now()}-${Math.round(Math.random() * 9999)}-${safeName}.webp`;
  } catch {
    return `product-${Date.now()}-${Math.round(Math.random() * 99999)}.webp`;
  }
};

/** Télécharge une image via fetch natif (Node 18+) et retourne un Buffer */
const downloadImage = async (url) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000); // timeout 20s

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } finally {
    clearTimeout(timeout);
  }
};

/** Convertit le buffer en WebP optimisé et l'enregistre sur le disque */
const saveAsWebp = async (buffer, filename) => {
  const outputPath = path.join(UPLOADS_DIR, filename);

  await sharp(buffer)
    .resize(MAX_WIDTH, MAX_HEIGHT, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .toFormat('webp')
    .webp({ quality: WEBP_QUALITY })
    .toFile(outputPath);

  // Taille finale
  const { size } = fs.statSync(outputPath);
  return { outputPath, sizeKb: Math.round(size / 1024) };
};

// ──────────────────────────────────────────────────────────
// PIPELINE PRINCIPAL
// ──────────────────────────────────────────────────────────
async function migrateImages() {
  console.log('\n');
  console.log('╔' + '═'.repeat(55) + '╗');
  console.log('║   🦊  FOXERSPORT — Pipeline de Migration Images    ║');
  console.log('╚' + '═'.repeat(55) + '╝');
  console.log('');

  // 1. Créer le dossier uploads si nécessaire
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    console.log(`📁 Dossier créé : ${UPLOADS_DIR}\n`);
  }

  // 2. Récupérer toutes les images de la BDD
  console.log('🔍 Analyse de la base de données...');
  const allImages = await prisma.productImage.findMany({
    select: { id: true, url: true, productId: true },
    orderBy: { productId: 'asc' },
  });

  const toMigrate = allImages.filter((img) => isExternalUrl(img.url));
  const alreadyLocal = allImages.filter((img) => !isExternalUrl(img.url));

  console.log(`   Total images en BDD       : ${allImages.length}`);
  console.log(`   ✅ Déjà locales (ignorées) : ${alreadyLocal.length}`);
  console.log(`   ⬇️  Externes à migrer      : ${toMigrate.length}\n`);

  if (toMigrate.length === 0) {
    console.log('✅ Aucune image externe à migrer. Tout est déjà local !\n');
    return;
  }

  // 3. Migration image par image
  console.log('─'.repeat(57));
  console.log('  Téléchargement + Optimisation WebP + Mise à jour BDD');
  console.log('─'.repeat(57));

  const errors = [];
  let success = 0;
  let failed = 0;
  let totalSavedKb = 0;

  for (let i = 0; i < toMigrate.length; i++) {
    const image = toMigrate[i];
    const idx = `[${String(i + 1).padStart(3, ' ')}/${toMigrate.length}]`;
    const shortUrl = image.url.length > 60
      ? image.url.substring(0, 57) + '...'
      : image.url;

    process.stdout.write(`${idx} ⬇️  ${shortUrl}\n        → `);

    try {
      // Étape 1: Téléchargement
      const buffer = await downloadImage(image.url);
      process.stdout.write('📥 Téléchargé → ');

      // Étape 2: Optimisation & sauvegarde
      const filename = generateFilename(image.url);
      const { sizeKb } = await saveAsWebp(buffer, filename);
      process.stdout.write(`💾 Sauvegardé (${sizeKb} KB) → `);
      totalSavedKb += sizeKb;

      // Étape 3: Mise à jour en BDD
      const newUrl = `${LOCAL_BASE_URL}/${filename}`;
      await prisma.productImage.update({
        where: { id: image.id },
        data: { url: newUrl },
      });

      process.stdout.write(`🗄️  BDD mise à jour ✅\n`);
      success++;
    } catch (error) {
      process.stdout.write(`❌ ERREUR: ${error.message}\n`);
      errors.push({ id: image.id, url: image.url, error: error.message });
      failed++;
    }

    // Pause entre requêtes
    if (i < toMigrate.length - 1) {
      await sleep(REQUEST_DELAY_MS);
    }
  }

  // 4. Rapport final
  console.log('\n╔' + '═'.repeat(55) + '╗');
  console.log('║                  📊 RAPPORT FINAL                  ║');
  console.log('╚' + '═'.repeat(55) + '╝');
  console.log(`   ✅ Images migrées avec succès : ${success}`);
  console.log(`   ❌ Échecs                     : ${failed}`);
  console.log(`   💾 Espace disque utilisé      : ~${Math.round(totalSavedKb / 1024 * 10) / 10} MB`);
  console.log(`   📁 Dossier des images         : public/uploads/`);

  if (errors.length > 0) {
    console.log('\n⚠️  Images en échec (à traiter manuellement) :');
    errors.forEach((e, idx) => {
      console.log(`\n   ${idx + 1}. ID BDD : ${e.id}`);
      console.log(`      URL     : ${e.url}`);
      console.log(`      Raison  : ${e.error}`);
    });

    // Sauvegarder les erreurs dans un fichier JSON
    const reportPath = path.join(__dirname, '..', 'migration-errors.json');
    fs.writeFileSync(reportPath, JSON.stringify({ timestamp: new Date().toISOString(), errors }, null, 2));
    console.log(`\n📄 Rapport d'erreurs sauvegardé dans : migration-errors.json`);
  }

  console.log('\n🎉 Pipeline terminé avec succès !\n');
}

// ──────────────────────────────────────────────────────────
// LANCEMENT
// ──────────────────────────────────────────────────────────
migrateImages()
  .catch((e) => {
    console.error('\n💥 Erreur critique :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
