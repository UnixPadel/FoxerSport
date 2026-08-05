import { Router } from 'express';
import { 
  getUserAddresses, 
  getAddressById, 
  createAddress, 
  updateAddress, 
  deleteAddress 
} from '../controllers/address.controller.js';
import { addressValidator } from '../validators/address.validator.js';
import { validate } from '../middleware/validate.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

// All address routes require authentication
router.use(verifyToken);

router.get('/', getUserAddresses);
router.get('/:id', getAddressById);
router.post('/', addressValidator, validate, createAddress);
router.put('/:id', addressValidator, validate, updateAddress);
router.delete('/:id', deleteAddress);

export default router;
