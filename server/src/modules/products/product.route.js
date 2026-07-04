const express = require('express');
const { getProducts, getProduct, createProduct, updateProduct, archiveProduct } = require('./product.controller');
const { protect, authorize } = require('../../middlewares/auth.middleware');

const router = express.Router();

const reviewRouter = require('../reviews/review.route');
router.use('/:productId/reviews', reviewRouter);

router.route('/')
  .get(getProducts)
  .post(protect, authorize('admin', 'seller'), createProduct);

router.route('/:id')
  .get(getProduct)
  .put(protect, authorize('admin', 'seller'), updateProduct)
  .delete(protect, authorize('admin', 'seller'), archiveProduct);

module.exports = router;
