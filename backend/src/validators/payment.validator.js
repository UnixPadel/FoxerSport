import { body, param } from 'express-validator';

// ─────────────────────────────────────────────────────────────────────
// Payment Validators — Chargily Pay v2
// ─────────────────────────────────────────────────────────────────────

/**
 * Valide la requête d'initialisation du paiement.
 */
export const validateInitializePayment = [
  body('orderId')
    .trim()
    .notEmpty().withMessage('orderId est requis')
    .isUUID().withMessage('orderId doit être un UUID valide'),
];

/**
 * Valide le paramètre orderId pour la vérification du statut.
 */
export const validatePaymentStatus = [
  param('orderId')
    .trim()
    .notEmpty().withMessage('orderId est requis')
    .isUUID().withMessage('orderId doit être un UUID valide'),
];
