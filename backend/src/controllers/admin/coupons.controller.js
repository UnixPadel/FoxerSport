import prisma from '../../utils/prisma.js';

// ─────────────────────────────────────────────────────────────────────
// Admin Coupons Controller — CRUD complet pour la gestion des coupons
// ─────────────────────────────────────────────────────────────────────

/**
 * Liste tous les coupons avec pagination.
 * GET /api/admin/coupons
 */
export const getAllCoupons = async (req, res) => {
  try {
    const { page = 1, limit = 20, isActive } = req.query;
    const pageNum  = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip     = (pageNum - 1) * limitNum;

    const where = {};
    if (isActive !== undefined) where.isActive = isActive === 'true';

    const [coupons, total] = await Promise.all([
      prisma.coupon.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
        include: {
          _count: { select: { orders: true } },
        },
      }),
      prisma.coupon.count({ where }),
    ]);

    return res.json({
      status: 'success',
      data: coupons,
      meta: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) },
    });
  } catch (error) {
    console.error('[Admin/Coupons] Erreur liste:', error.message);
    return res.status(500).json({ status: 'error', message: 'Erreur lors de la récupération des coupons' });
  }
};

/**
 * Créer un nouveau coupon.
 * POST /api/admin/coupons
 */
export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      type,
      value,
      currency,
      minOrderAmount,
      maxDiscount,
      usageLimit,
      perUserLimit = 1,
      validFrom,
      validUntil,
      isActive = true,
    } = req.body;

    if (!code || !type || !value) {
      return res.status(400).json({ status: 'error', message: 'Le code, le type et la valeur sont requis' });
    }

    const validTypes = ['percentage', 'fixed_amount', 'free_shipping'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ status: 'error', message: `Type invalide. Valeurs acceptées: ${validTypes.join(', ')}` });
    }

    if (type === 'percentage' && (parseFloat(value) <= 0 || parseFloat(value) > 100)) {
      return res.status(400).json({ status: 'error', message: 'Le pourcentage doit être entre 1 et 100' });
    }

    const existing = await prisma.coupon.findUnique({ where: { code: code.toUpperCase().trim() } });
    if (existing) {
      return res.status(409).json({ status: 'error', message: 'Ce code promo existe déjà' });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code:           code.toUpperCase().trim(),
        type,
        value:          parseFloat(value),
        currency:       currency || 'DZD',
        minOrderAmount: minOrderAmount ? parseFloat(minOrderAmount) : null,
        maxDiscount:    maxDiscount ? parseFloat(maxDiscount) : null,
        usageLimit:     usageLimit ? parseInt(usageLimit) : null,
        perUserLimit:   parseInt(perUserLimit),
        validFrom:      validFrom ? new Date(validFrom) : null,
        validUntil:     validUntil ? new Date(validUntil) : null,
        isActive,
      },
    });

    return res.status(201).json({ status: 'success', data: coupon });
  } catch (error) {
    console.error('[Admin/Coupons] Erreur création:', error.message);
    return res.status(500).json({ status: 'error', message: 'Erreur lors de la création du coupon' });
  }
};

/**
 * Modifier un coupon existant.
 * PUT /api/admin/coupons/:id
 */
export const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      type, value, currency, minOrderAmount, maxDiscount,
      usageLimit, perUserLimit, validFrom, validUntil, isActive,
    } = req.body;

    const existing = await prisma.coupon.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ status: 'error', message: 'Coupon introuvable' });
    }

    const coupon = await prisma.coupon.update({
      where: { id },
      data: {
        ...(type           !== undefined && { type }),
        ...(value          !== undefined && { value: parseFloat(value) }),
        ...(currency       !== undefined && { currency }),
        ...(minOrderAmount !== undefined && { minOrderAmount: minOrderAmount ? parseFloat(minOrderAmount) : null }),
        ...(maxDiscount    !== undefined && { maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null }),
        ...(usageLimit     !== undefined && { usageLimit: usageLimit ? parseInt(usageLimit) : null }),
        ...(perUserLimit   !== undefined && { perUserLimit: parseInt(perUserLimit) }),
        ...(validFrom      !== undefined && { validFrom: validFrom ? new Date(validFrom) : null }),
        ...(validUntil     !== undefined && { validUntil: validUntil ? new Date(validUntil) : null }),
        ...(isActive       !== undefined && { isActive }),
      },
    });

    return res.json({ status: 'success', data: coupon });
  } catch (error) {
    console.error('[Admin/Coupons] Erreur modification:', error.message);
    return res.status(500).json({ status: 'error', message: 'Erreur lors de la modification du coupon' });
  }
};

/**
 * Supprimer un coupon.
 * DELETE /api/admin/coupons/:id
 */
export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.coupon.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ status: 'error', message: 'Coupon introuvable' });
    }

    // Désactiver au lieu de supprimer si des commandes l'utilisent
    const usedInOrders = await prisma.order.count({ where: { couponId: id } });
    if (usedInOrders > 0) {
      await prisma.coupon.update({ where: { id }, data: { isActive: false } });
      return res.json({ status: 'success', message: 'Coupon désactivé (utilisé dans des commandes existantes)' });
    }

    await prisma.coupon.delete({ where: { id } });
    return res.json({ status: 'success', message: 'Coupon supprimé avec succès' });
  } catch (error) {
    console.error('[Admin/Coupons] Erreur suppression:', error.message);
    return res.status(500).json({ status: 'error', message: 'Erreur lors de la suppression du coupon' });
  }
};
