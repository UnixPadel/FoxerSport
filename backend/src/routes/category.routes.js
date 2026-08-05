import { Router } from 'express';
import { getCategories, getCategoryBySlug } from '../controllers/category.controller.js';
import { cacheRoute } from '../middleware/cache.js';

const router = Router();

// Get all categories as a tree (Cached for 1 hour)
router.get('/', cacheRoute(3600), getCategories);

// Get single category by Slug (Cached for 1 hour)
router.get('/:slug', cacheRoute(3600), getCategoryBySlug);

export default router;
