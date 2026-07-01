const express = require('express');
const { getSellerMetrics, getSellerProducts, createSellerProduct, updateSellerProfile } = require('./seller.controller');
const { protect, authorize } = require('../../middlewares/auth.middleware');
const { upload } = require('../../middlewares/upload.middleware');

const router = express.Router();

router.use(protect);
router.use(authorize('seller', 'admin'));

router.route('/metrics').get(getSellerMetrics);
router.route('/products')
  .get(getSellerProducts)
  .post(upload.single('image'), createSellerProduct);
router.route('/profile').put(updateSellerProfile);

module.exports = router;
