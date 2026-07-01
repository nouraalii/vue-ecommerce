const express = require('express');
const { createOrder, getMyOrders, getOrderById, validatePromo } = require('./order.controller');
const { protect } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.route('/validate-promo').post(validatePromo);

router.route('/')
  .post(protect, createOrder);

router.route('/myorders')
  .get(protect, getMyOrders);

router.route('/:id')
  .get(protect, getOrderById);

module.exports = router;
