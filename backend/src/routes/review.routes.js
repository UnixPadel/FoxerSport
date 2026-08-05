import { Router } from 'express';
import { addReview, getProductReviews } from '../controllers/review.controller.js';
import { reviewValidator } from '../validators/review.validator.js';
import { validate } from '../middleware/validate.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

// Public route to get reviews
router.get('/product/:productId', getProductReviews);

// Protected route to post review
router.use(verifyToken);
router.post('/', reviewValidator, validate, addReview);

export default router;
