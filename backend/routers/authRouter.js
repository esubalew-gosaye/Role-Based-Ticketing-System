import express from 'express';
import authController from '../controllers/authController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/login', authController.login);
router.post('/logout', authMiddleware, authController.logout);

router.patch('/change-password', authMiddleware, authController.changePassword);

router.patch(
  '/send-verification-code',
  authMiddleware,
  authController.sendVerificationCode
);
router.patch(
  '/verify-verification-code',
  authMiddleware,
  authController.verifyVerificationCode
);

router.patch(
  '/send-forgot-password-code',
  authController.sendForgotPasswordCode
);
router.patch(
  '/verify-forgot-password-code',
  authController.verifyForgotPasswordCode
);

export default router;
