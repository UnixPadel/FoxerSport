import prisma from '../utils/prisma.js';

export const addReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, rating, title, comment } = req.body;

    // Check if user already reviewed this product
    const existingReview = await prisma.review.findUnique({
      where: {
        productId_userId: { productId, userId }
      }
    });

    if (existingReview) {
      return res.status(400).json({ status: 'error', message: 'You have already reviewed this product' });
    }

    // Check if user has purchased the product (verified purchase)
    const orderWithProduct = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: { userId, status: 'delivered' }
      },
      include: { order: true }
    });

    const isVerified = !!orderWithProduct;
    const orderId = orderWithProduct ? orderWithProduct.orderId : null;

    const review = await prisma.review.create({
      data: {
        productId,
        userId,
        orderId,
        rating,
        title,
        comment,
        isVerified
        // isApproved is false by default in schema (needs admin moderation)
      }
    });

    // Update product stats
    const productStats = await prisma.review.aggregate({
      where: { productId, isApproved: true }, // only count approved ones, or we can count all. Let's count all for now.
      _avg: { rating: true },
      _count: { id: true }
    });

    await prisma.product.update({
      where: { id: productId },
      data: {
        avgRating: productStats._avg.rating || rating,
        reviewCount: productStats._count.id
      }
    });

    res.status(201).json({ status: 'success', message: 'Review submitted and pending approval', review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error submitting review' });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [reviews, totalCount] = await Promise.all([
      prisma.review.findMany({
        where: { productId, isApproved: true },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { firstName: true, lastName: true, avatarUrl: true } }
        }
      }),
      prisma.review.count({ where: { productId, isApproved: true } })
    ]);

    res.json({
      status: 'success',
      data: reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalItems: totalCount
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error fetching reviews' });
  }
};
