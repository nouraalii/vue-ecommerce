const Order = require('./order.model');
const Product = require('../products/product.model');
const Promo = require('./promo.model');

const normalizePromoCode = code => String(code || '').trim().toUpperCase();

const getPromoDetails = async code => {
  const normalizedCode = normalizePromoCode(code);

  if (!normalizedCode) return null;

  if (normalizedCode === 'VUE20') {
    return {
      code: 'VUE20',
      discountType: 'percentage',
      discountValue: 20
    };
  }

  const promo = await Promo.findOne({ code: normalizedCode });

  if (!promo || !promo.isActive) return null;

  if (promo.expiresAt && promo.expiresAt < new Date()) return null;

  return {
    code: promo.code,
    discountType: 'percentage',
    discountValue: promo.discountPercentage
  };
};

const calculateDiscountAmount = (promo, subTotal = 0) => {
  if (!promo) return 0;

  if (promo.discountType === 'fixed_amount') {
    return Math.min(Number(promo.discountValue) || 0, subTotal);
  }

  return Math.min(subTotal * ((Number(promo.discountValue) || 0) / 100), subTotal);
};

const buildPromoResponse = (promo, subTotal = 0) => ({
  ...promo,
  discountAmount: Number(calculateDiscountAmount(promo, subTotal).toFixed(2))
});

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, taxPrice, shippingPrice, promoCode } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items' });
    }

    if (paymentMethod !== 'cod') {
      return res.status(400).json({
        success: false,
        message: 'Only cash on delivery is available in demo mode'
      });
    }

    // Map frontend shippingAddress to backend schema structure
    const mappedShippingAddress = {
      street: shippingAddress.address,
      city: shippingAddress.city,
      zipCode: shippingAddress.postalCode,
      country: shippingAddress.country
    };

    // 1. Calculate prices from DB to avoid client-side spoofing
    let subTotal = 0;
    const finalOrderItems = [];

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        throw new Error(`Product not found: ${item.product}`);
      }
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.title}`);
      }

      // Add to total
      subTotal += product.basePrice * item.quantity;

      // Prepare final order item
      finalOrderItems.push({
        product: product._id,
        name: product.title,
        quantity: item.quantity,
        price: product.basePrice
      });

      // Decrement stock
      product.stock -= item.quantity;
      await product.save();
    }

    const appliedPromo = await getPromoDetails(promoCode);
    if (promoCode && !appliedPromo) {
      return res.status(400).json({ success: false, message: 'Invalid or expired promo code' });
    }

    const appliedDiscount = Number(calculateDiscountAmount(appliedPromo, subTotal).toFixed(2));
    const totalAmount = subTotal + (taxPrice || 0) + (shippingPrice || 0) - appliedDiscount;

    // 2. Create the order
    const order = new Order({
      customer: req.user.id,
      items: finalOrderItems,
      shippingAddress: mappedShippingAddress,
      paymentMethod,
      subTotal,
      tax: taxPrice,
      shippingPrice,
      promoCode: appliedPromo ? appliedPromo.code : undefined,
      discountAmount: appliedDiscount,
      totalAmount,
      paymentStatus: 'pending',
      orderStatus: 'placed'
    });

    const createdOrder = await order.save();

    res.status(201).json({
      success: true,
      data: createdOrder
    });

  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Validate Promo Code
// @route   POST /api/v1/orders/validate-promo
// @access  Public
exports.validatePromo = async (req, res) => {
  try {
    const { code, subTotal = 0 } = req.body;
    
    if (!code) {
      return res.status(400).json({ success: false, message: 'Promo code is required' });
    }

    const promo = await getPromoDetails(code);

    if (!promo) {
      return res.status(400).json({ success: false, message: 'Invalid or expired promo code' });
    }

    res.status(200).json({
      success: true,
      data: buildPromoResponse(promo, Number(subTotal) || 0)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get all orders
// @route   GET /api/v1/orders
// @access  Private/Admin
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort('-createdAt')
      .populate('customer', 'name email');
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update order status
// @route   PUT /api/v1/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) {
      if (paymentStatus === 'paid' && order.paymentMethod !== 'cod') {
        return res.status(400).json({
          success: false,
          message: 'Gateway payments cannot be marked paid without provider verification'
        });
      }
      order.paymentStatus = paymentStatus;
    }

    await order.save();
    res.status(200).json({ success: true, data: order });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/v1/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user.id }).sort('-createdAt');
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/v1/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('customer', 'name email');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check if user is authorized to view this order (customer who placed it or admin)
    if (order.customer._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
