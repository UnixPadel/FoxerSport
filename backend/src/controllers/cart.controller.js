import prisma from '../utils/prisma.js';

export const getCart = async (req, res) => {
  try {
    const userId = req.user?.id;
    const sessionId = req.query.sessionId;

    if (!userId && !sessionId) {
      return res.status(400).json({ status: 'error', message: 'Provide userId or sessionId' });
    }

    const where = userId ? { userId } : { sessionId };

    const cartItems = await prisma.cartItem.findMany({
      where,
      include: {
        product: { select: { id: true, translations: true, slug: true, priceTry: true, images: { take: 1 } } },
        variant: true
      }
    });

    res.json({ status: 'success', cartItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error fetching cart' });
  }
};

export const addToCart = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { sessionId, productId, variantId, quantity = 1 } = req.body;

    if (!userId && !sessionId) {
      return res.status(400).json({ status: 'error', message: 'Provide userId or sessionId' });
    }

    const whereClause = {
      productId,
      ...(variantId && { variantId }),
      ...(userId ? { userId } : { sessionId })
    };

    // Check if item already in cart
    const existingItem = await prisma.cartItem.findFirst({ where: whereClause });

    if (existingItem) {
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity }
      });
      return res.json({ status: 'success', cartItem: updatedItem });
    }

    const newItem = await prisma.cartItem.create({
      data: {
        productId,
        ...(variantId && { variantId }),
        ...(userId && { userId }),
        ...(!userId && sessionId && { sessionId }),
        quantity
      }
    });

    res.status(201).json({ status: 'success', cartItem: newItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error adding to cart' });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const updatedItem = await prisma.cartItem.update({
      where: { id },
      data: { quantity }
    });

    res.json({ status: 'success', cartItem: updatedItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error updating cart item' });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.cartItem.delete({ where: { id } });

    res.json({ status: 'success', message: 'Item removed from cart' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error removing from cart' });
  }
};

export const calculateShipping = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { sessionId, countryCode } = req.body;

    if (!countryCode) {
      return res.status(400).json({ status: 'error', message: 'Country code is required' });
    }

    const where = userId ? { userId } : { sessionId };
    const cartItems = await prisma.cartItem.findMany({
      where,
      include: {
        product: { select: { weightGrams: true } }
      }
    });

    if (cartItems.length === 0) {
      return res.json({ status: 'success', shippingStatus: 'CALCULATED', shippingCost: 0 });
    }

    let totalWeightGrams = 0;
    let hasMissingWeight = false;

    for (const item of cartItems) {
      if (item.product.weightGrams == null) {
        hasMissingWeight = true;
        break;
      }
      totalWeightGrams += (item.product.weightGrams * item.quantity);
    }

    if (hasMissingWeight || totalWeightGrams === 0) {
      return res.json({ 
        status: 'success', 
        shippingStatus: 'WEIGHT_MISSING', 
        shippingCost: null 
      });
    }

    const totalWeightKg = totalWeightGrams / 1000;

    // Find the shipping zone for the given country
    // The `countries` array stores CCA2 codes (like 'FR', 'TR') or fallbacks
    const zones = await prisma.shippingZone.findMany({
      where: { isActive: true }
    });

    let targetZone = null;
    for (const zone of zones) {
      if (zone.countries.includes(countryCode)) {
        targetZone = zone;
        break;
      }
    }

    if (!targetZone) {
      return res.json({
        status: 'error',
        message: 'Shipping is not available for this country',
        shippingStatus: 'NOT_SUPPORTED',
        shippingCost: null
      });
    }

    // Find the appropriate price in the weightRates
    // weightRates is { "0.5": 57.25, "1": 84.10, "2": 112.15, ... }
    const rates = targetZone.weightRates || {};
    
    // Sort brackets ascending
    const brackets = Object.keys(rates).map(Number).sort((a, b) => a - b);
    
    let selectedPrice = null;
    for (const bracket of brackets) {
      if (bracket >= totalWeightKg) {
        selectedPrice = rates[bracket];
        break;
      }
    }

    // If weight exceeds the maximum bracket, use the maximum bracket price 
    // or add logic for over-weight later. For now, max bracket.
    if (selectedPrice === null && brackets.length > 0) {
      selectedPrice = rates[brackets[brackets.length - 1]];
    }

    if (selectedPrice === null) {
      return res.json({
        status: 'error',
        message: 'No rates defined for this zone',
        shippingStatus: 'NOT_SUPPORTED',
        shippingCost: null
      });
    }

    return res.json({
      status: 'success',
      shippingStatus: 'CALCULATED',
      shippingCost: selectedPrice,
      currency: targetZone.currency
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error calculating shipping' });
  }
};

