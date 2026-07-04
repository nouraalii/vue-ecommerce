const Order = require('./order.model');
const User = require('../users/user.model');
const { sendEmail } = require('../../utils/email');
const {
  getPromoDetails,
  buildPromoResponse,
  prepareOrderItems,
  computeTotals
} = require('./order.service');

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

    const appliedPromo = await getPromoDetails(promoCode);
    if (promoCode && !appliedPromo) {
      return res.status(400).json({ success: false, message: 'Invalid or expired promo code' });
    }

    // 1. Calculate prices from DB to avoid client-side spoofing (also decrements stock)
    const { finalOrderItems, subTotal } = await prepareOrderItems(orderItems);
    const { appliedDiscount, totalAmount } = computeTotals({ subTotal, taxPrice, shippingPrice, appliedPromo });

    // 2. Create the order
    const order = new Order({
      customer: req.user._id,
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

    // Send Order Placed Email
    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px;">
        <h2 style="color: #4f46e5; text-align: center; margin-bottom: 24px;">Order Placed Successfully!</h2>
        <p>Hi <strong>${req.user.name}</strong>,</p>
        <p>Thank you for shopping with us. Your order <strong>#${createdOrder._id.toString().substring(createdOrder._id.toString().length - 8).toUpperCase()}</strong> has been successfully placed.</p>
        <div style="background-color: #f9fafb; padding: 16px; border-radius: 12px; margin: 20px 0;">
          <p style="margin: 0 0 8px 0;"><strong>Order Details:</strong></p>
          <ul style="padding-left: 20px; margin: 0;">
            ${createdOrder.items.map(item => `<li>${item.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}</li>`).join('')}
          </ul>
          <p style="margin: 12px 0 0 0;"><strong>Total Amount:</strong> <span style="color: #4f46e5; font-weight: bold;">$${createdOrder.totalAmount.toFixed(2)}</span></p>
        </div>
        <p>We are processing your order and will notify you when it ships.</p>
        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p>Best regards,<br>The eShop Team</p>
      </div>
    `;

    try {
      await sendEmail({
        to: req.user.email,
        subject: `Your eShop Order #${createdOrder._id.toString().substring(createdOrder._id.toString().length - 8).toUpperCase()} has been placed!`,
        html: emailHtml
      });
    } catch (err) {
      console.error('Failed to send order placed notification email:', err);
    }

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
    const order = await Order.findById(req.params.id).populate('customer', 'name email');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const previousStatus = order.orderStatus;

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

    // Trigger status change emails
    if (orderStatus && orderStatus !== previousStatus) {
      const orderRef = order._id.toString().substring(order._id.toString().length - 8).toUpperCase();
      let subject = '';
      let headline = '';
      let msg = '';

      if (orderStatus === 'shipped') {
        subject = `Your eShop Order #${orderRef} has been shipped!`;
        headline = 'Order Shipped!';
        msg = 'Great news! Your order is on its way to you.';
      } else if (orderStatus === 'delivered') {
        subject = `Your eShop Order #${orderRef} has been delivered!`;
        headline = 'Order Delivered!';
        msg = 'Your package has been successfully delivered. Thank you for shopping with us!';
      }

      if (subject) {
        const emailHtml = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px;">
            <h2 style="color: #4f46e5; text-align: center; margin-bottom: 24px;">${headline}</h2>
            <p>Hi <strong>${order.customer?.name || 'Customer'}</strong>,</p>
            <p>${msg}</p>
            <div style="background-color: #f9fafb; padding: 16px; border-radius: 12px; margin: 20px 0;">
              <p style="margin: 0 0 8px 0;"><strong>Order ID:</strong> #${orderRef}</p>
              <p style="margin: 0 0 8px 0;"><strong>Status:</strong> <span style="text-transform: capitalize; color: #4f46e5; font-weight: bold;">${orderStatus}</span></p>
              <p style="margin: 12px 0 0 0;"><strong>Total Items:</strong> ${order.items.length}</p>
            </div>
            <p>We hope to see you again soon!</p>
            <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
            <p>Best regards,<br>The eShop Team</p>
          </div>
        `;
        try {
          await sendEmail({
            to: order.customer?.email,
            subject,
            html: emailHtml
          });
        } catch (err) {
          console.error(`Failed to send order status email for ${orderStatus}:`, err);
        }
      }
    }

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
    const orders = await Order.find({ customer: req.user._id }).sort('-createdAt');
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

    // Check if user is authorized to view this order (customer who placed it or admin or seller who owns an item in it)
    let isSellerOwner = false;
    if (req.user.role === 'seller') {
      const Product = require('../products/product.model');
      const sellerProducts = await Product.find({ seller: req.user._id });
      const sellerProductIds = sellerProducts.map(p => p._id.toString());
      isSellerOwner = order.items.some(item => sellerProductIds.includes(item.product.toString()));
    }

    if (order.customer._id.toString() !== req.user._id.toString() && req.user.role !== 'admin' && !isSellerOwner) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get seller orders (orders that contain at least one product owned by this seller)
// @route   GET /api/v1/orders/seller
// @access  Private/Seller
exports.getSellerOrders = async (req, res) => {
  try {
    const Product = require('../products/product.model');
    const sellerProducts = await Product.find({ seller: req.user._id });
    const sellerProductIds = sellerProducts.map(p => p._id.toString());

    const orders = await Order.find({ 'items.product': { $in: sellerProductIds } })
      .sort('-createdAt')
      .populate('customer', 'name email');

    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update individual item status in an order
// @route   PUT /api/v1/orders/:id/item-status
// @access  Private/Seller
exports.updateOrderItemStatus = async (req, res) => {
  try {
    const { itemId, status } = req.body; // status: 'processing', 'shipped', 'delivered', 'cancelled'

    if (!itemId || !status) {
      return res.status(400).json({ success: false, message: 'Please provide itemId and status' });
    }

    const order = await Order.findById(req.params.id).populate('customer', 'name email');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const item = order.items.find(it => it._id.toString() === itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found in this order' });
    }

    // Verify item belongs to this seller's products
    const Product = require('../products/product.model');
    const product = await Product.findById(item.product);
    if (!product || !product.seller || product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to manage this item' });
    }

    const previousItemStatus = item.itemStatus;
    item.itemStatus = status;

    // Update seller earnings/balance if item status changed to delivered
    if (status === 'delivered' && previousItemStatus !== 'delivered') {
      const itemTotal = item.price * item.quantity;
      const netEarnings = itemTotal * 0.9; // 10% platform fee
      
      const sellerUser = await User.findById(req.user._id);
      if (sellerUser) {
        sellerUser.sellerProfile.earnings += netEarnings;
        sellerUser.sellerProfile.balance += netEarnings;
        await sellerUser.save();
      }
    }

    // Recalculate overall orderStatus
    const itemStatuses = order.items.map(it => it.itemStatus);
    const uniqueStatuses = [...new Set(itemStatuses)];
    
    let newOrderStatus = order.orderStatus;
    if (uniqueStatuses.every(s => s === 'cancelled')) {
      newOrderStatus = 'cancelled';
    } else if (uniqueStatuses.every(s => ['delivered', 'cancelled'].includes(s))) {
      newOrderStatus = 'delivered';
    } else if (uniqueStatuses.every(s => ['shipped', 'delivered', 'cancelled'].includes(s))) {
      newOrderStatus = 'shipped';
    } else if (itemStatuses.some(s => ['shipped', 'delivered'].includes(s))) {
      newOrderStatus = 'partially_shipped';
    } else if (itemStatuses.some(s => s === 'processing')) {
      newOrderStatus = 'processing';
    }

    const overallStatusChanged = newOrderStatus !== order.orderStatus;
    order.orderStatus = newOrderStatus;

    await order.save();

    // Trigger email notifications if overall status changed to shipped/delivered
    if (overallStatusChanged) {
      const orderRef = order._id.toString().substring(order._id.toString().length - 8).toUpperCase();
      let subject = '';
      let headline = '';
      let msg = '';

      if (newOrderStatus === 'shipped') {
        subject = `Your eShop Order #${orderRef} has been shipped!`;
        headline = 'Order Shipped!';
        msg = 'Great news! All items in your order have been shipped and are on their way to you.';
      } else if (newOrderStatus === 'delivered') {
        subject = `Your eShop Order #${orderRef} has been delivered!`;
        headline = 'Order Delivered!';
        msg = 'All items in your order have been successfully delivered. Thank you!';
      }

      if (subject) {
        const emailHtml = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px;">
            <h2 style="color: #4f46e5; text-align: center; margin-bottom: 24px;">${headline}</h2>
            <p>Hi <strong>${order.customer?.name || 'Customer'}</strong>,</p>
            <p>${msg}</p>
            <div style="background-color: #f9fafb; padding: 16px; border-radius: 12px; margin: 20px 0;">
              <p style="margin: 0 0 8px 0;"><strong>Order ID:</strong> #${orderRef}</p>
              <p style="margin: 0 0 8px 0;"><strong>Status:</strong> <span style="text-transform: capitalize; color: #4f46e5; font-weight: bold;">${newOrderStatus}</span></p>
              <p style="margin: 12px 0 0 0;"><strong>Total Items:</strong> ${order.items.length}</p>
            </div>
            <p>Thank you for shopping with us!</p>
            <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
            <p>Best regards,<br>The eShop Team</p>
          </div>
        `;
        try {
          await sendEmail({
            to: order.customer?.email,
            subject,
            html: emailHtml
          });
        } catch (err) {
          console.error(`Failed to send order status email for ${newOrderStatus}:`, err);
        }
      }
    }

    res.status(200).json({ success: true, data: order });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
