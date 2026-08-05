import { Router } from 'express';
import { verifyToken, isAdmin } from '../middleware/auth.js';
import { upload, optimizeImage } from '../middleware/upload.js';
import { uploadImage, uploadImages } from '../controllers/upload.controller.js';
import multer from 'multer';

const router = Router();

// Toutes les routes upload sont protégées (admin uniquement)
router.use(verifyToken, isAdmin);

// ── Upload d'une seule image ──────────────────────────────────────────
// POST /api/upload/image
// Content-Type: multipart/form-data, champ: "image"
router.post(
  '/image',
  upload.single('image'),
  optimizeImage,
  uploadImage
);

// ── Upload de plusieurs images (max 10) ──────────────────────────────
// POST /api/upload/images
// Content-Type: multipart/form-data, champ: "images"
router.post(
  '/images',
  upload.array('images', 10),
  // Optimise chaque image de req.files
  async (req, res, next) => {
    if (!req.files || req.files.length === 0) return next();
    const sharp = (await import('sharp')).default;
    const path  = (await import('path')).default;
    const fs    = (await import('fs')).default;

    try {
      for (const file of req.files) {
        file.filename = `product-${Date.now()}-${Math.round(Math.random() * 1000)}.webp`;
        await sharp(file.buffer)
          .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
          .toFormat('webp')
          .webp({ quality: 80 })
          .toFile(`public/uploads/${file.filename}`);
      }
      next();
    } catch (err) {
      console.error('[Upload] Erreur Sharp multi-upload:', err);
      return res.status(500).json({ status: 'error', message: 'Erreur traitement des images' });
    }
  },
  uploadImages
);

export default router;
