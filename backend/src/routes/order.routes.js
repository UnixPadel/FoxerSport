import { Router } from 'express';
import { createOrder, getUserOrders, getOrderById } from '../controllers/order.controller.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

// Orders require authentication
router.use(verifyToken);

router.post('/', createOrder);
router.get('/', getUserOrders);
router.get('/:id', getOrderById);

export default router;
