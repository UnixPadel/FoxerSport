import prisma from '../../utils/prisma.js';
import meiliClient from '../../utils/meilisearch.js';

export const createProduct = async (req, res) => {
  try {
    const { 
      slug, categoryId, brand, sku, priceTry, stockQuantity, weightGrams,
      translations, images, variants
    } = req.body;

    const product = await prisma.product.create({
      data: {
        slug, categoryId, brand, sku, priceTry, stockQuantity, weightGrams,
        translations: { create: translations },
        images: { create: images },
        variants: { create: variants }
      },
      include: {
        translations: true,
        images: true,
        variants: true
      }
    });

    // Add to Meilisearch
    const searchDoc = {
      id: product.id,
      name: translations.find(t => t.locale === 'en')?.name || '',
      brand,
      priceTry,
      categoryId,
      createdAt: product.createdAt.getTime()
    };
    try {
      await meiliClient.index('products').addDocuments([searchDoc]);
    } catch (meiliErr) {
      console.error('Meilisearch Error (Create):', meiliErr.message);
    }

    res.status(201).json({ status: 'success', message: 'Product created', product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error creating product' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { priceTry, compareAtPriceTry, stockQuantity, isActive, brand, isFeatured, weightGrams } = req.body;

    const product = await prisma.product.update({
      where: { id },
      data: { priceTry, compareAtPriceTry, stockQuantity, isActive, brand, isFeatured, weightGrams }
    });

    // Update Meilisearch
    try {
      const updateData = { id };
      if (priceTry !== undefined) updateData.priceTry = priceTry;
      if (brand !== undefined) updateData.brand = brand;
      await meiliClient.index('products').updateDocuments([updateData]);
    } catch (meiliErr) {
      console.error('Meilisearch Error (Update):', meiliErr.message);
    }

    res.json({ status: 'success', message: 'Product updated', product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error updating product' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // We soft-delete or hard-delete? Let's just make it inactive (soft delete)
    await prisma.product.update({
      where: { id },
      data: { isActive: false }
    });

    try {
      await meiliClient.index('products').deleteDocument(id);
    } catch (meiliErr) {
      console.error('Meilisearch Error (Delete):', meiliErr.message);
    }

    res.json({ status: 'success', message: 'Product deactivated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error deleting product' });
  }
};

export const uploadProductImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'Aucune image n\'a été uploadée' });
    }

    // L'image a été traitée par Sharp et sauvegardée dans public/uploads/
    const imageUrl = `${process.env.BACKEND_URL || 'http://localhost:3000'}/uploads/${req.file.filename}`;

    // Le front-end pourra utiliser cette URL pour la lier à un produit lors de sa création
    res.status(200).json({ 
      status: 'success', 
      message: 'Image uploadée et optimisée avec succès',
      imageUrl 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Erreur lors du retour de l\'image' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        translations: true,
        images: { orderBy: { sortOrder: 'asc' } },
        category: { include: { translations: true } }
      }
    });

    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }

    res.json({ status: 'success', data: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error fetching product' });
  }
};
