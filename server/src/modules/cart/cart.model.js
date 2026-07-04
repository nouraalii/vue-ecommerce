const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  price: { type: Number, required: true }
}, { _id: false });

const CartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [CartItemSchema],
  totalPrice: { type: Number, default: 0 }
}, { timestamps: true });

CartSchema.methods.calculateTotal = function() {
  this.totalPrice = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

module.exports = mongoose.model('Cart', CartSchema);
