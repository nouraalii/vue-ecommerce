const User = require('./user.model');

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const query = {};
    if (req.query.role) query.role = req.query.role;
    
    if (req.query.status) {
      query.accountStatus = req.query.status;
    }

    const users = await User.find(query).select('-password');
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update user status (Approve/Restrict/Soft Delete)
// @route   PUT /api/v1/users/:id/status
// @access  Private/Admin
exports.updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['active', 'restricted', 'deleted'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    if (req.params.id === req.user._id.toString() && status !== 'active') {
      return res.status(400).json({ success: false, message: 'You cannot restrict or delete your own account' });
    }

    const update = {
      accountStatus: status,
      deletedAt: status === 'deleted' ? Date.now() : null
    };

    const user = await User.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true
    }).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get dashboard metrics for Admin
// @route   GET /api/v1/users/metrics
// @access  Private/Admin
exports.getAdminMetrics = async (req, res) => {
  try {
    const Order = require('../orders/order.model');
    const Product = require('../products/product.model');

    const totalUsers = await User.countDocuments({ accountStatus: { $ne: 'deleted' } });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    
    // Aggregate total sales
    const salesAggregate = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, totalSales: { $sum: '$totalAmount' } } }
    ]);
    
    const totalSales = salesAggregate.length > 0 ? salesAggregate[0].totalSales : 0;

    // Recent orders
    const recentOrders = await Order.find()
      .sort('-createdAt')
      .limit(5)
      .populate('customer', 'name email');

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalSales,
        recentOrders
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
