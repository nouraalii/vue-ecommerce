const mongoose = require('mongoose');
const Product = require('../products/product.model');
const User = require('../users/user.model');

const wishlistPopulate = {
  path: 'wishlist',
  populate: {
    path: 'category',
    select: 'name slug'
  }
};

const sendWishlist = async (res, userId, statusCode = 200) => {
  const user = await User.findById(userId).populate(wishlistPopulate);

  res.status(statusCode).json({
    success: true,
    count: user.wishlist.length,
    data: user.wishlist
  });
};

const isValidObjectId = id => mongoose.Types.ObjectId.isValid(id);

// @desc    Get logged in user wishlist
// @route   GET /api/v1/wishlist
// @access  Private
exports.getWishlist = async (req, res) => {
  try {
    await sendWishlist(res, req.user._id);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Add product to logged in user wishlist
// @route   POST /api/v1/wishlist/:productId
// @access  Private
exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!isValidObjectId(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid product id' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { wishlist: product._id }
    });

    await sendWishlist(res, req.user._id, 201);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Remove product from logged in user wishlist
// @route   DELETE /api/v1/wishlist/:productId
// @access  Private
exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!isValidObjectId(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid product id' });
    }

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { wishlist: productId }
    });

    await sendWishlist(res, req.user._id);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Clear logged in user wishlist
// @route   DELETE /api/v1/wishlist
// @access  Private
exports.clearWishlist = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $set: { wishlist: [] }
    });

    res.status(200).json({ success: true, count: 0, data: [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
