import { Router } from 'express';
import { getCart, addToCart, updateCartItem, removeFromCart, calculateShipping } from '../controllers/cart.controller.js';
// We don't use strict verifyToken because users can be guests (using sessionId)
// But we can parse token if it exists

import jwt from 'jsonwebtoken';

const optionalAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (e) {
      // ignore invalid token for cart, they can still use session
    }
  }
  next();
};

const router = Router();

router.use(optionalAuth);

router.get('/', getCart);
router.post('/', addToCart);
router.post('/calculate-shipping', calculateShipping);
router.put('/:id', updateCartItem);
router.delete('/:id', removeFromCart);

export default router;
