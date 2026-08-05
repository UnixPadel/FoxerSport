import { body } from 'express-validator';
import prisma from '../utils/prisma.js';

export const registerValidator = [
  body('email')
    .isEmail().withMessage('Must be a valid email address')
    .custom(async (email) => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (user) {
        throw new Error('E-mail already in use');
      }
    }),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('firstName')
    .notEmpty().withMessage('First name is required'),
  body('lastName')
    .notEmpty().withMessage('Last name is required'),
];

export const loginValidator = [
  body('email').isEmail().withMessage('Must be a valid email address'),
  body('password').notEmpty().withMessage('Password is required'),
];
