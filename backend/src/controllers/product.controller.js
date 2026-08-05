import prisma from '../utils/prisma.js';
import meiliClient from '../utils/meilisearch.js';

export const getProducts = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      categorySlug,
      brand,
      minPrice,
      maxPrice,
      ids,
      isFeatured,
      sort = 'newest', // newest, priceAsc, priceDesc, popular, rating
      searchQuery
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Build filter conditions
    const where = {}; 
    if (req.query.isAdmin !== 'true') {
      where.isActive = true;
    }

    if (searchQuery) {
      where.OR = [
        { sku: { contains: searchQuery, mode: 'insensitive' } },
        { translations: { some: { name: { contains: searchQuery, mode: 'insensitive' } } } }
      ];
    }

    if (ids) {
      const idArray = ids.split(',').map(id => id.trim()).filter(id => id);
      where.id = { in: idArray };
    }

    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured === 'true';
    }
    
    if (categorySlug) {
      const category = await prisma.category.findUnique({
        where: { slug: categorySlug },
        include: {
          children: {
            include: {
              children: true
            }
          }
        }
      });

      if (category) {
        const categoryIds = [category.id];
        if (category.children) {
          category.children.forEach(child => {
            categoryIds.push(child.id);
            if (child.children) {
              child.children.forEach(grandchild => {
                categoryIds.push(grandchild.id);
              });
            }
          });
        }
        where.categoryId = { in: categoryIds };
      } else {
        where.category = { slug: categorySlug };
      }
    }
    if (brand) {
      where.brand = brand;
    }
    if (minPrice || maxPrice) {
      where.priceTry = {};
      if (minPrice) where.priceTry.gte = parseFloat(minPrice);
      if (maxPrice) where.priceTry.lte = parseFloat(maxPrice);
    }

    // Build sort conditions
    let orderBy = { createdAt: 'desc' }; // default newest
    if (sort === 'priceAsc') orderBy = { priceTry: 'asc' };
    if (sort === 'priceDesc') orderBy = { priceTry: 'desc' };
    if (sort === 'popular') orderBy = { soldCount: 'desc' };
    if (sort === 'rating') orderBy = { avgRating: 'desc' };

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          translations: true,
          images: { where: { isPrimary: true }, take: 1 },
          category: { select: { id: true, slug: true, translations: true } }
        }
      }),
      prisma.product.count({ where })
    ]);

    res.json({
      status: 'success',
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / take)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error fetching products' });
  }
};

export const getProductBySlug = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug },
      include: {
        translations: true,
        images: { orderBy: { sortOrder: 'asc' } },
        variants: { where: { isActive: true } },
        category: { include: { translations: true } }
      }
    });

    if (!product || !product.isActive) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }

    // Update view count in background
    prisma.product.update({
      where: { id: product.id },
      data: { viewCount: { increment: 1 } }
    }).catch(console.error);

    res.json({ status: 'success', product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error fetching product details' });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const { q, limit = 5 } = req.query;
    
    if (!q) {
      return res.json({ status: 'success', hits: [] });
    }

    const searchResults = await meiliClient.index('products').search(q, {
      limit: parseInt(limit),
      attributesToHighlight: ['name']
    });

    res.json({ status: 'success', hits: searchResults.hits });
  } catch (error) {
    console.error('Meilisearch Error:', error);
    res.status(500).json({ status: 'error', message: 'Search failed' });
  }
};

export const getRelatedProducts = async (req, res) => {
  try {
    const { slug } = req.params;
    const { limit = 4 } = req.query;
    
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        relatedToOthers: {
          include: {
            relatedProduct: {
              include: { translations: true, images: { where: { isPrimary: true }, take: 1 }, category: { select: { slug: true, translations: true } } }
            }
          },
          take: parseInt(limit)
        }
      }
    });

    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }

    let relatedProducts = product.relatedToOthers.map(r => r.relatedProduct).filter(p => p.isActive);

    // Fallback: if not enough related products, fetch from same category
    if (relatedProducts.length < parseInt(limit) && product.categoryId) {
      const additionalRelated = await prisma.product.findMany({
        where: {
          categoryId: product.categoryId,
          id: { notIn: [product.id, ...relatedProducts.map(p => p.id)] },
          isActive: true
        },
        include: {
          translations: true,
          images: { where: { isPrimary: true }, take: 1 },
          category: { select: { slug: true, translations: true } }
        },
        take: parseInt(limit) - relatedProducts.length
      });
      relatedProducts = [...relatedProducts, ...additionalRelated];
    }

    res.json({ status: 'success', data: relatedProducts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error fetching related products' });
  }
};

export const applyBulkDiscount = async (req, res) => {
  try {
    const { percentage, remove } = req.body;

    if (remove) {
      // Remove all discounts: set compareAtPriceTry to null, and restore priceTry
      await prisma.$executeRaw`
        UPDATE products 
        SET price_try = COALESCE(compare_at_price_try, price_try), 
            compare_at_price_try = NULL 
        WHERE compare_at_price_try IS NOT NULL
      `;
      
      return res.status(200).json({ status: 'success', message: 'All global discounts removed.' });
    }

    if (!percentage || percentage <= 0 || percentage >= 100) {
      return res.status(400).json({ status: 'error', message: 'Invalid percentage' });
    }

    const discountFactor = 1 - (percentage / 100);

    // Apply discount
    await prisma.$executeRaw`
      UPDATE products 
      SET compare_at_price_try = COALESCE(compare_at_price_try, price_try),
          price_try = COALESCE(compare_at_price_try, price_try) * ${discountFactor}
      WHERE is_active = true
    `;

    res.status(200).json({ status: 'success', message: `Applied ${percentage}% discount to all active products.` });

  } catch (error) {
    console.error('Error applying bulk discount:', error);
    res.status(500).json({ status: 'error', message: 'Failed to apply bulk discount' });
  }
};

