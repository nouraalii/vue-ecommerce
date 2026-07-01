const Order = require('../orders/order.model');
const Product = require('../products/product.model');
const User = require('../users/user.model');

// @desc    Get dashboard metrics for Seller
// @route   GET /api/v1/seller/metrics
// @access  Private/Seller
exports.getSellerMetrics = async (req, res) => {
  try {
    const sellerId = req.user.id;

    const totalProducts = await Product.countDocuments({ seller: sellerId });
    
    // Aggregate total sales for this specific seller from the orders
    const salesAggregate = await Order.aggregate([
      { $match: { paymentStatus: 'paid', sellers: sellerId } },
      { $unwind: '$items' },
      { $match: { 'items.seller': sellerId } },
      { $group: { _id: null, totalSales: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } }
    ]);
    
    const totalSales = salesAggregate.length > 0 ? salesAggregate[0].totalSales : 0;

    // Get orders containing this seller's products
    const recentOrders = await Order.find({ sellers: sellerId })
      .sort('-createdAt')
      .limit(5)
      .populate('customer', 'name email');

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        totalSales,
        recentOrders
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get all products for this seller
// @route   GET /api/v1/seller/products
// @access  Private/Seller
exports.getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user.id }).populate('category', 'name');
    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create a product
// @route   POST /api/v1/seller/products
// @access  Private/Seller
exports.createSellerProduct = async (req, res) => {
  try {
    req.body.seller = req.user.id;
    
    if (req.file) {
      req.body.images = [{ url: req.file.path, alt: req.body.title }];
    }

    // Set to pending_approval or active based on config. We'll set active for demo
    req.body.status = 'active';

    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Update seller profile
// @route   PUT /api/v1/seller/profile
// @access  Private/Seller
exports.updateSellerProfile = async (req, res) => {
  try {
    const { storeName, description } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.sellerDetails = {
      ...user.sellerDetails,
      storeName: storeName || user.sellerDetails.storeName,
      description: description || user.sellerDetails.description,
    };
    
    await user.save();

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
