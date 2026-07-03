const express = require('express');
const {
  addToWishlist,
  clearWishlist,
  getWishlist,
  removeFromWishlist
} = require('./wishlist.controller');
const { protect } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getWishlist)
  .delete(clearWishlist);

router.route('/:productId')
  .post(addToWishlist)
  .delete(removeFromWishlist);

module.exports = router;
