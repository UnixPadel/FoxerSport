import { Router } from 'express';
import { getInfoPage, listInfoPages } from '../controllers/info.controller.js';

const router = Router();

// ── Pages d'information publiques ─────────────────────────────────────
// GET /api/info              → Liste toutes les pages (slugs)
// GET /api/info/:slug        → Récupère une page par slug
// GET /api/info/:slug?locale=ar → Avec locale spécifique
router.get('/', listInfoPages);
router.get('/:slug', getInfoPage);

export default router;
