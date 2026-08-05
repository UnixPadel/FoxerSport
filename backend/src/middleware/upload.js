import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

// Configuration de Multer pour stocker le fichier temporairement en mémoire (RAM)
const multerStorage = multer.memoryStorage();

// Filtre de sécurité : n'accepter que les images
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Veuillez uploader uniquement des images !'), false);
  }
};

export const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Limite à 5 Mo maximum par image pour la sécurité (DDoS)
  }
});

// Middleware d'optimisation d'image avec Sharp
export const optimizeImage = async (req, res, next) => {
  if (!req.file) return next(); // Si pas de fichier, on continue

  // Génération d'un nom de fichier unique et sécurisé
  req.file.filename = `product-${Date.now()}-${Math.round(Math.random() * 1000)}.webp`;

  try {
    // Sharp : Redimensionnement intelligent et conversion en WebP (Très léger)
    await sharp(req.file.buffer)
      .resize(800, 800, {
        fit: 'inside', // Garde les proportions, ne dépasse pas 800x800
        withoutEnlargement: true
      })
      .toFormat('webp')
      .webp({ quality: 80 }) // 80% de qualité = invisible à l'oeil nu mais 5x plus léger
      .toFile(`public/uploads/${req.file.filename}`);

    next();
  } catch (error) {
    console.error('Erreur Sharp :', error);
    res.status(500).json({ status: 'error', message: 'Erreur lors du traitement de l\'image' });
  }
};
