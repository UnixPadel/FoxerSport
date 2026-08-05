import express from 'express';
import { createReturnRequest, getMyReturns } from '../controllers/return.controller.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Routes protégées
router.use(verifyToken);

router.route('/')
  .post(createReturnRequest)
  .get(getMyReturns);

export default router;
