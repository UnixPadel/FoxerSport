import { Router } from 'express';
import { register, login, getMe, googleLogin, logout } from '../controllers/auth.controller.js';
import { registerValidator, loginValidator } from '../validators/auth.validator.js';
import { validate } from '../middleware/validate.js';
import { verifyToken } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/register', authLimiter, registerValidator, validate, register);
router.post('/login', authLimiter, loginValidator, validate, login);
router.post('/google', authLimiter, googleLogin);
router.get('/me', verifyToken, getMe);
router.post('/logout', logout);

export default router;
