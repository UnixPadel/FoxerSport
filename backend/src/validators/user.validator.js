import { body } from 'express-validator';

export const updateProfileValidator = [
  body('firstName').optional().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().notEmpty().withMessage('Last name cannot be empty'),
  body('phone').optional().isString(),
  body('preferredLang').optional().isLength({ min: 2, max: 5 }),
  body('preferredCurrency').optional().isLength({ min: 3, max: 3 }),
];

export const changePasswordValidator = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long'),
];
