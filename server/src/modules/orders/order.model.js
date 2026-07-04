const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    variantId: mongoose.Schema.Types.ObjectId,
    name: String, 
    price: Number, 
    quantity: { type: Number, required: true },
    itemStatus: { type: String, enum: ['processing', 'shipped', 'delivered', 'cancelled'], default: 'processing' }
  }],

  // Cost breakdown
  subTotal: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  shippingPrice: { type: Number, default: 0.0 },
  promoCode: { type: String },
  discountAmount: { type: Number, default: 0.0 },
  totalAmount: { type: Number, required: true },
  
  // Payment InfoCodeApplied: { type: mongoose.Schema.Types.ObjectId, ref: 'Promo' },

  // Addresses & Payment
  shippingAddress: { 
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  paymentMethod: { type: String, enum: ['cod', 'stripe'], required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  paymentProviderRef: String, // Stripe PaymentIntent ID, PayPal order ID, etc.

  // Overall Status
  orderStatus: { type: String, enum: ['placed', 'processing', 'partially_shipped', 'shipped', 'delivered', 'cancelled'], default: 'placed' }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
