import { Router } from 'express';
import {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getMe,
} from '../controllers/auth.controller';
import { protect } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  verifyEmailValidator,
} from '../validators/auth.validator';

const router = Router();

router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);
router.post('/verify-email', verifyEmailValidator, validate, verifyEmail);
router.post('/forgot-password', forgotPasswordValidator, validate, forgotPassword);
router.post('/reset-password', resetPasswordValidator, validate, resetPassword);
router.get('/me', protect, getMe);

export default router;