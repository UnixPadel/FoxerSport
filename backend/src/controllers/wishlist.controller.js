import prisma from '../utils/prisma.js';

export const getWishlist = async (req, res) => {
  try {
    const wishlist = await prisma.wishlistItem.findMany({
      where: { userId: req.user.id },
      include: {
        product: {
          select: { 
            id: true, 
            slug: true, 
            priceTry: true, 
            images: { take: 1, where: { isPrimary: true } },
            translations: { select: { name: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ status: 'success', wishlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error fetching wishlist' });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ status: 'error', message: 'Product ID is required' });
    }

    const existingItem = await prisma.wishlistItem.findUnique({
      where: { userId_productId: { userId, productId } }
    });

    if (existingItem) {
      return res.status(400).json({ status: 'error', message: 'Product already in wishlist' });
    }

    const item = await prisma.wishlistItem.create({
      data: { userId, productId }
    });

    res.status(201).json({ status: 'success', message: 'Added to wishlist', item });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error adding to wishlist' });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    await prisma.wishlistItem.delete({
      where: { userId_productId: { userId, productId } }
    });

    res.json({ status: 'success', message: 'Removed from wishlist' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error removing from wishlist' });
  }
};
