const express = require('express');
const { getProducts, getProduct, createProduct } = require('./product.controller');
const { protect, authorize } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, authorize('seller', 'admin'), createProduct);

router.route('/:id')
  .get(getProduct);

module.exports = router;
