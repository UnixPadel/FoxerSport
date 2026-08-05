import prisma from '../utils/prisma.js';

// ─────────────────────────────────────────────────────────────────────
// Coupon Controller — Validation et application des coupons
// ─────────────────────────────────────────────────────────────────────

/**
 * Valide un code promo et calcule la remise applicable.
 * POST /api/coupons/validate
 * Body: { code: string, orderTotal: number, currency?: string }
 */
export const validateCoupon = async (req, res) => {
  try {
    const userId = req.user.id;
    const { code, orderTotal, currency = 'DZD' } = req.body;

    if (!code || !orderTotal) {
      return res.status(400).json({ status: 'error', message: 'Le code et le total de commande sont requis' });
    }

    // ── Récupérer le coupon ────────────────────────────────────────
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase().trim() },
    });

    if (!coupon) {
      return res.status(404).json({ status: 'error', message: 'Code promo invalide ou inexistant' });
    }

    // ── Vérifications de validité ──────────────────────────────────
    if (!coupon.isActive) {
      return res.status(400).json({ status: 'error', message: 'Ce code promo est désactivé' });
    }

    const now = new Date();
    if (coupon.validFrom && coupon.validFrom > now) {
      return res.status(400).json({ status: 'error', message: 'Ce code promo n\'est pas encore valide' });
    }

    if (coupon.validUntil && coupon.validUntil < now) {
      return res.status(400).json({ status: 'error', message: 'Ce code promo est expiré' });
    }

    if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
      return res.status(400).json({ status: 'error', message: 'Ce code promo a atteint sa limite d\'utilisation' });
    }

    if (coupon.minOrderAmount && parseFloat(orderTotal) < parseFloat(coupon.minOrderAmount)) {
      return res.status(400).json({
        status: 'error',
        message: `Ce code promo requiert un minimum de ${coupon.minOrderAmount} ${currency}`,
      });
    }

    // ── Vérifier la limite par utilisateur ────────────────────────
    if (coupon.perUserLimit > 0) {
      const userUsageCount = await prisma.order.count({
        where: { userId, couponId: coupon.id, status: { notIn: ['cancelled', 'refunded'] } },
      });

      if (userUsageCount >= coupon.perUserLimit) {
        return res.status(400).json({
          status: 'error',
          message: 'Vous avez déjà utilisé ce code promo le nombre de fois autorisé',
        });
      }
    }

    // ── Calculer la remise ─────────────────────────────────────────
    let discountAmount = 0;

    if (coupon.type === 'percentage') {
      discountAmount = (parseFloat(orderTotal) * parseFloat(coupon.value)) / 100;
      if (coupon.maxDiscount) {
        discountAmount = Math.min(discountAmount, parseFloat(coupon.maxDiscount));
      }
    } else if (coupon.type === 'fixed_amount') {
      discountAmount = Math.min(parseFloat(coupon.value), parseFloat(orderTotal));
    } else if (coupon.type === 'free_shipping') {
      discountAmount = 0; // La remise sur livraison est gérée au niveau de la commande
    }

    discountAmount = Math.round(discountAmount * 100) / 100; // 2 décimales

    return res.json({
      status: 'success',
      data: {
        couponId:       coupon.id,
        code:           coupon.code,
        type:           coupon.type,
        value:          parseFloat(coupon.value),
        discountAmount,
        isFreeShipping: coupon.type === 'free_shipping',
        message:        getDiscountMessage(coupon, discountAmount, currency),
      },
    });
  } catch (error) {
    console.error('[Coupon] Erreur validation:', error.message);
    return res.status(500).json({ status: 'error', message: 'Erreur lors de la validation du coupon' });
  }
};

/**
 * Génère un message lisible pour la remise.
 */
const getDiscountMessage = (coupon, discountAmount, currency) => {
  if (coupon.type === 'percentage') {
    return `${coupon.value}% de remise appliquée (-${discountAmount} ${currency})`;
  } else if (coupon.type === 'fixed_amount') {
    return `Remise de ${discountAmount} ${currency} appliquée`;
  } else if (coupon.type === 'free_shipping') {
    return 'Livraison gratuite appliquée';
  }
  return 'Code promo appliqué';
};
