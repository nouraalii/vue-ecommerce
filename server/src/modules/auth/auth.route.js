const express = require('express');
const { register, login, getMe, updateProfile, getPaymentMethods, addPaymentMethod, removePaymentMethod } = require('./auth.controller');
const { protect } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/me', protect, updateProfile);
router.get('/me/payment-methods', protect, getPaymentMethods);
router.post('/me/payment-methods', protect, addPaymentMethod);
router.delete('/me/payment-methods/:methodId', protect, removePaymentMethod);

module.exports = router;
