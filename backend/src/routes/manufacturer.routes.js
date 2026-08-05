import express from 'express';
import { getManufacturers, getManufacturer } from '../controllers/manufacturer.controller.js';

const router = express.Router();

router.get('/', getManufacturers);
router.get('/:slug', getManufacturer);

export default router;
