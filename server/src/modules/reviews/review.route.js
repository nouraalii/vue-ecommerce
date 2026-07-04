const express = require('express');
const { getReviews, createReview, updateReview, deleteReview } = require('./review.controller');
const { protect } = require('../../middlewares/auth.middleware');

const router = express.Router({ mergeParams: true });

router.route('/')
  .get(getReviews)
  .post(protect, createReview);

router.route('/:id')
  .put(protect, updateReview)
  .delete(protect, deleteReview);

module.exports = router;
