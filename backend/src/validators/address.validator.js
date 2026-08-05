import { body } from 'express-validator';

export const addressValidator = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('addressLine1').notEmpty().withMessage('Address line 1 is required'),
  body('city').notEmpty().withMessage('City is required'),
  body('postalCode').notEmpty().withMessage('Postal code is required'),
  body('countryCode').optional().isLength({ min: 2, max: 2 }).withMessage('Country code must be 2 characters'),
  body('isDefault').optional().isBoolean(),
];
