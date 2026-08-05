import meiliClient from '../utils/meilisearch.js';
import prisma from '../utils/prisma.js';

// ─────────────────────────────────────────────────────────────────────
// Search Controller — Meilisearch
// ─────────────────────────────────────────────────────────────────────

/**
 * Recherche full-text de produits avec Meilisearch.
 * GET /api/search?q=raquette&category=1&brand=Head&sort=priceTry:asc&page=1
 */
export const searchProducts = async (req, res) => {
  try {
    const {
      q = '',
      category,
      brand,
      sort = 'soldCount:desc',
      page = 1,
      limit = 20,
      locale = 'fr',
    } = req.query;

    const pageNum  = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const offset   = (pageNum - 1) * limitNum;

    // ── Construire les filtres Meilisearch ─────────────────────────
    const filters = ['isActive = true'];

    if (category) filters.push(`categoryId = ${parseInt(category)}`);
    if (brand)    filters.push(`brand = "${brand}"`);

    // ── Paramètres de tri ──────────────────────────────────────────
    const validSorts = ['priceTry:asc', 'priceTry:desc', 'createdAt:desc', 'soldCount:desc', 'avgRating:desc'];
    const sortParam  = validSorts.includes(sort) ? [sort] : ['soldCount:desc'];

    const index = meiliClient.index('products');

    const result = await index.search(q, {
      filter:           filters.join(' AND '),
      sort:             sortParam,
      offset,
      limit:            limitNum,
      attributesToRetrieve: [
        'id', 'slug', 'sku', 'priceTry', 'priceEur', 'priceUsd',
        'compareAtPriceTry', 'stockQuantity', 'brand', 'avgRating',
        'reviewCount', 'soldCount', 'categoryId', 'isFeatured',
        'isActive', 'createdAt', 'images', 'translations',
      ],
    });

    return res.json({
      status: 'success',
      data: {
        hits:            result.hits,
        totalHits:       result.totalHits ?? result.estimatedTotalHits,
        page:            pageNum,
        limit:           limitNum,
        processingTimeMs: result.processingTimeMs,
        query:           q,
      },
    });
  } catch (error) {
    console.error('[Search] Erreur:', error.message);
    return res.status(500).json({ status: 'error', message: 'Erreur lors de la recherche' });
  }
};

/**
 * Indexe un produit dans Meilisearch.
 * Appelé automatiquement lors de la création/modification d'un produit.
 *
 * @param {Object} product - Produit Prisma complet (avec translations, images)
 */
export const indexProduct = async (product) => {
  try {
    const index = meiliClient.index('products');

    // Extraire les infos nécessaires pour l'indexation
    const doc = {
      id:               product.id,
      slug:             product.slug,
      sku:              product.sku,
      priceTry:         parseFloat(product.priceTry) || 0,
      priceEur:         parseFloat(product.priceEur) || null,
      priceUsd:         parseFloat(product.priceUsd) || null,
      compareAtPriceTry: parseFloat(product.compareAtPriceTry) || null,
      stockQuantity:    product.stockQuantity,
      brand:            product.brand || null,
      avgRating:        parseFloat(product.avgRating) || 0,
      reviewCount:      product.reviewCount || 0,
      soldCount:        product.soldCount || 0,
      viewCount:        product.viewCount || 0,
      categoryId:       product.categoryId || null,
      isFeatured:       product.isFeatured || false,
      isActive:         product.isActive,
      createdAt:        product.createdAt?.toISOString() || new Date().toISOString(),

      // Texte pour la recherche full-text (toutes les langues)
      searchText: product.translations?.map(t => `${t.name} ${t.shortDescription || ''}`).join(' ') || '',

      // Données pour l'affichage (images principales)
      images: product.images?.filter(img => img.isPrimary).map(img => img.url) ||
              product.images?.slice(0, 1).map(img => img.url) || [],

      // Traductions pour l'affichage multilingue
      translations: product.translations?.reduce((acc, t) => {
        acc[t.locale] = { name: t.name, shortDescription: t.shortDescription };
        return acc;
      }, {}) || {},
    };

    await index.addDocuments([doc], { primaryKey: 'id' });
    console.info(`[Search] ✅ Produit indexé: ${product.id}`);
  } catch (error) {
    // Non-bloquant : ne pas faire échouer l'opération principale
    console.error(`[Search] Erreur indexation produit ${product.id}:`, error.message);
  }
};

/**
 * Supprime un produit de l'index Meilisearch.
 *
 * @param {string} productId - UUID du produit à supprimer
 */
export const deleteProductFromIndex = async (productId) => {
  try {
    const index = meiliClient.index('products');
    await index.deleteDocument(productId);
    console.info(`[Search] 🗑️ Produit supprimé de l'index: ${productId}`);
  } catch (error) {
    console.error(`[Search] Erreur suppression index produit ${productId}:`, error.message);
  }
};

/**
 * Réindexe tous les produits actifs depuis la base de données.
 * Utile pour une réinitialisation complète de l'index.
 * GET /api/search/reindex (admin uniquement)
 */
export const reindexAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        translations: true,
        images: true,
      },
    });

    const index = meiliClient.index('products');

    const docs = products.map((product) => ({
      id:               product.id,
      slug:             product.slug,
      sku:              product.sku,
      priceTry:         parseFloat(product.priceTry) || 0,
      priceEur:         parseFloat(product.priceEur) || null,
      priceUsd:         parseFloat(product.priceUsd) || null,
      compareAtPriceTry: parseFloat(product.compareAtPriceTry) || null,
      stockQuantity:    product.stockQuantity,
      brand:            product.brand || null,
      avgRating:        parseFloat(product.avgRating) || 0,
      reviewCount:      product.reviewCount || 0,
      soldCount:        product.soldCount || 0,
      categoryId:       product.categoryId || null,
      isFeatured:       product.isFeatured || false,
      isActive:         product.isActive,
      createdAt:        product.createdAt?.toISOString(),
      searchText:       product.translations?.map(t => `${t.name} ${t.shortDescription || ''}`).join(' ') || '',
      images:           product.images?.filter(img => img.isPrimary).map(img => img.url) ||
                        product.images?.slice(0, 1).map(img => img.url) || [],
      translations:     product.translations?.reduce((acc, t) => {
        acc[t.locale] = { name: t.name, shortDescription: t.shortDescription };
        return acc;
      }, {}) || {},
    }));

    if (docs.length > 0) {
      await index.addDocuments(docs, { primaryKey: 'id' });
    }

    return res.json({
      status: 'success',
      message: `${docs.length} produits réindexés avec succès`,
    });
  } catch (error) {
    console.error('[Search] Erreur réindexation:', error.message);
    return res.status(500).json({ status: 'error', message: 'Erreur lors de la réindexation' });
  }
};
