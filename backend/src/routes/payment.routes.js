import { Router } from 'express';
import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { paymentLimiter } from '../middleware/rateLimiter.js';
import { validateInitializePayment, validatePaymentStatus } from '../validators/payment.validator.js';
import {
  initializePayment,
  handleChargilyWebhook,
  getPaymentStatus,
} from '../controllers/payment.controller.js';

const router = Router();

// ── Initialiser le paiement (requiert auth + rate limit) ─────────────
router.post(
  '/initialize',
  verifyToken,
  paymentLimiter,
  validateInitializePayment,
  validate,
  initializePayment
);

// ── Webhook Chargily (SANS auth JWT — sécurisé par signature HMAC) ───
// IMPORTANT: express.raw() doit être appliqué ICI (avant express.json global)
// pour que le body reste un Buffer brut, nécessaire à la vérification HMAC.
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  handleChargilyWebhook
);

// ── Vérifier le statut de paiement (requiert auth) ───────────────────
router.get(
  '/status/:orderId',
  verifyToken,
  validatePaymentStatus,
  validate,
  getPaymentStatus
);

export default router;
