import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { validateCoupon } from '../controllers/coupon.controller.js';

const router = Router();

// ── Valider un code promo (requiert authentification) ─────────────────
// POST /api/coupons/validate
// Body: { code: "PROMO10", orderTotal: 5000 }
router.post('/validate', verifyToken, validateCoupon);

export default router;
