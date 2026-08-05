import { Router } from 'express';
import { verifyToken, isAdmin } from '../middleware/auth.js';
import { searchProducts, reindexAllProducts } from '../controllers/search.controller.js';

const router = Router();

// ── Recherche publique ────────────────────────────────────────────────
// GET /api/search?q=raquette&category=1&brand=Head&sort=priceTry:asc&page=1
router.get('/', searchProducts);

// ── Réindexation (admin uniquement) ──────────────────────────────────
// GET /api/search/reindex
router.get('/reindex', verifyToken, isAdmin, reindexAllProducts);

export default router;
