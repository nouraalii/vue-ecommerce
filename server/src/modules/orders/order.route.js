const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  validatePromo,
  getOrders,
  updateOrderStatus,
  getSellerOrders,
  updateOrderItemStatus
} = require('./order.controller');
const { protect, authorize } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.route('/validate-promo').post(validatePromo);

router.route('/')
  .get(protect, authorize('admin'), getOrders)
  .post(protect, createOrder);

router.route('/myorders')
  .get(protect, getMyOrders);

router.route('/seller')
  .get(protect, authorize('seller'), getSellerOrders);

router.route('/:id')
  .get(protect, getOrderById);

router.route('/:id/status')
  .put(protect, authorize('admin'), updateOrderStatus);

router.route('/:id/item-status')
  .put(protect, authorize('seller'), updateOrderItemStatus);

module.exports = router;
