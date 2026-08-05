import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// ─────────────────────────────────────────────────────────────────────
// Upload Controller
// Le middleware `upload` + `optimizeImage` (multer + sharp) est déjà
// géré dans src/middleware/upload.js. Ce controller gère uniquement
// la réponse après que l'image a été traitée.
// ─────────────────────────────────────────────────────────────────────

/**
 * Upload et optimisation d'une image unique.
 * POST /api/upload/image (admin uniquement)
 *
 * Middleware requis (dans la route) : upload.single('image'), optimizeImage
 * Retourne l'URL publique de l'image.
 */
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'Aucun fichier image fourni' });
    }

    // L'image a été traitée par le middleware optimizeImage de multer/sharp
    // req.file.filename contient le nom du fichier généré (ex: product-1234567890-123.webp)
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000';
    const imageUrl   = `${backendUrl}/uploads/${req.file.filename}`;

    return res.status(201).json({
      status: 'success',
      data: {
        url:      imageUrl,
        filename: req.file.filename,
      },
    });
  } catch (error) {
    console.error('[Upload] Erreur:', error.message);
    return res.status(500).json({ status: 'error', message: 'Erreur lors de l\'upload de l\'image' });
  }
};

/**
 * Upload de plusieurs images (jusqu'à 10).
 * POST /api/upload/images (admin uniquement)
 *
 * Middleware requis : upload.array('images', 10)
 */
export const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ status: 'error', message: 'Aucun fichier image fourni' });
    }

    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000';

    const images = req.files.map((file) => ({
      url:      `${backendUrl}/uploads/${file.filename}`,
      filename: file.filename,
    }));

    return res.status(201).json({
      status: 'success',
      data:   images,
      count:  images.length,
    });
  } catch (error) {
    console.error('[Upload] Erreur multi-upload:', error.message);
    return res.status(500).json({ status: 'error', message: 'Erreur lors de l\'upload des images' });
  }
};
