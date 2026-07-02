const express = require('express');
const { getCategories, createCategory, updateCategory, archiveCategory } = require('./category.controller');
const { protect, authorize } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.route('/')
  .get(getCategories)
  .post(protect, authorize('admin'), createCategory);

router.route('/:id')
  .put(protect, authorize('admin'), updateCategory)
  .delete(protect, authorize('admin'), archiveCategory);

module.exports = router;
