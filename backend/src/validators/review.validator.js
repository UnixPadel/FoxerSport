import { body } from 'express-validator';

export const reviewValidator = [
  body('productId').notEmpty().withMessage('Product ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5'),
  body('title').optional().isString(),
  body('comment').optional().isString(),
];
