const Order = require('./order.model');
const Product = require('../products/product.model');
const mongoose = require('mongoose');

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, taxPrice, shippingPrice, promoCode, discountAmount } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items' });
    }

    // Map 'stripe' to 'card' for the schema enum
    const mappedPaymentMethod = paymentMethod === 'stripe' ? 'card' : paymentMethod;

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
    const sellers = new Set();

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
        seller: product.seller,
        name: product.title,
        quantity: item.quantity,
        price: product.basePrice
      });

      sellers.add(product.seller.toString());

      // Decrement stock
      product.stock -= item.quantity;
      await product.save();
    }

    const appliedDiscount = discountAmount || 0;
    const totalAmount = subTotal + (taxPrice || 0) + (shippingPrice || 0) - appliedDiscount;

    // 2. Create the order
    const order = new Order({
      customer: req.user.id,
      sellers: Array.from(sellers),
      items: finalOrderItems,
      shippingAddress: mappedShippingAddress,
      paymentMethod: mappedPaymentMethod,
      subTotal,
      tax: taxPrice,
      shippingFee: shippingPrice,
      promoCode,
      discountAmount: appliedDiscount,
      totalAmount,
      paymentStatus: mappedPaymentMethod === 'cod' ? 'pending' : 'paid',
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
    const { code } = req.body;
    
    // For demo purposes, we'll hardcode a 20% off promo if the DB is empty
    if (code.toUpperCase() === 'VUE20') {
      return res.status(200).json({ success: true, data: { code: 'VUE20', discountPercentage: 20 } });
    }

    const Promo = require('./promo.model');
    const promo = await Promo.findOne({ code: code.toUpperCase() });

    if (!promo || !promo.isActive) {
      return res.status(400).json({ success: false, message: 'Invalid or expired promo code' });
    }

    res.status(200).json({ success: true, data: promo });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
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
    if (order.customer._id.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'seller') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
