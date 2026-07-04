const express = require('express');
const { getPromos, createPromo, updatePromo, deletePromo } = require('./promo.controller');
const { protect, authorize } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.route('/')
  .get(protect, authorize('admin'), getPromos)
  .post(protect, authorize('admin'), createPromo);

router.route('/:id')
  .put(protect, authorize('admin'), updatePromo)
  .delete(protect, authorize('admin'), deletePromo);

module.exports = router;
