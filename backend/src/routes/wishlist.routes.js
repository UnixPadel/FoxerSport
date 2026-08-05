import { Router } from 'express';
import { getWishlist, addToWishlist, removeFromWishlist } from '../controllers/wishlist.controller.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

// All wishlist routes require authentication
router.use(verifyToken);

router.get('/', getWishlist);
router.post('/', addToWishlist);
router.delete('/:productId', removeFromWishlist);

export default router;
