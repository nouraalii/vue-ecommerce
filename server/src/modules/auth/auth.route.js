const express = require('express');
const {
  register,
  login,
  getMe,
  updateProfile,
  getPaymentMethods,
  addPaymentMethod,
  removePaymentMethod,
  googleLogin,
  verifyEmail,
  resendVerification,
  upgradeSeller,
  getSellerStats,
  requestPayout
} = require('./auth.controller');
const { protect } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google-login', googleLogin);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);
router.post('/upgrade-seller', protect, upgradeSeller);
router.get('/me/seller-stats', protect, getSellerStats);
router.post('/me/request-payout', protect, requestPayout);

router.get('/me', protect, getMe);
router.put('/me', protect, updateProfile);
router.get('/me/payment-methods', protect, getPaymentMethods);
router.post('/me/payment-methods', protect, addPaymentMethod);
router.delete('/me/payment-methods/:methodId', protect, removePaymentMethod);

module.exports = router;
