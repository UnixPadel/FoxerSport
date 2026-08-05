import { Router } from 'express';
import { getProducts, getProductBySlug, searchProducts, getRelatedProducts } from '../controllers/product.controller.js';
import { cacheRoute } from '../middleware/cache.js';

const router = Router();

// Public routes
// Mettre en cache la liste des produits pendant 5 minutes (300 secondes)
router.get('/', cacheRoute(300), getProducts);

// Mettre en cache les résultats de recherche fréquents (Meilisearch) pendant 5 minutes
router.get('/search', cacheRoute(300), searchProducts);

// Mettre en cache les produits similaires pendant 5 minutes
router.get('/:slug/related', cacheRoute(300), getRelatedProducts);

// Mettre en cache les détails d'un produit (Fiche produit) pendant 5 minutes
router.get('/:slug', cacheRoute(300), getProductBySlug);

export default router;
