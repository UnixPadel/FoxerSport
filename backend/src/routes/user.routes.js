import { Router } from 'express';
import { updateProfile, changePassword } from '../controllers/user.controller.js';
import { updateProfileValidator, changePasswordValidator } from '../validators/user.validator.js';
import { validate } from '../middleware/validate.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

// All user routes require authentication
router.use(verifyToken);

router.put('/profile', updateProfileValidator, validate, updateProfile);
router.put('/password', changePasswordValidator, validate, changePassword);

export default router;
