const express = require('express');
const { getCategories, createCategory } = require('./category.controller');
const { protect, authorize } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.route('/')
  .get(getCategories)
  .post(protect, authorize('admin'), createCategory);

module.exports = router;
