import express from 'express';
import { getSettings, updateSettings } from '../controllers/setting.controller.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public route to get all settings (e.g. promo banner text)
router.get('/', getSettings);

// Admin route to update settings
router.put('/', verifyToken, isAdmin, updateSettings);

export default router;
