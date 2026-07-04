const express = require('express');
const { createCheckoutSession } = require('./payment.controller');
const { protect } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.route('/create-checkout-session').post(protect, createCheckoutSession);

module.exports = router;
