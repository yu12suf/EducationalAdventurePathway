import { body } from 'express-validator';

export const registerValidator = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('firstName').notEmpty().withMessage('First name required'),
  body('lastName').notEmpty().withMessage('Last name required'),
  body('role').isIn(['student', 'counselor']).withMessage('Role must be student or counselor'),
];

export const loginValidator = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
];

export const forgotPasswordValidator = [
  body('email').isEmail().normalizeEmail(),
];

export const resetPasswordValidator = [
  body('token').notEmpty(),
  body('newPassword').isLength({ min: 6 }),
];

export const verifyEmailValidator = [
  body('token').notEmpty(),
];