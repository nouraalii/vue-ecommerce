const express = require('express');
const { getProducts, getProduct, createProduct, updateProduct, archiveProduct } = require('./product.controller');
const { protect, authorize } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, authorize('admin'), createProduct);

router.route('/:id')
  .get(getProduct)
  .put(protect, authorize('admin'), updateProduct)
  .delete(protect, authorize('admin'), archiveProduct);

module.exports = router;
