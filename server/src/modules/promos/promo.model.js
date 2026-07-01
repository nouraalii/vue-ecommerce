const mongoose = require('mongoose');

const PromoSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountType: { type: String, enum: ['percentage', 'fixed_amount'], required: true },
  discountValue: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  usageLimit: { type: Number, default: null }, // Total times it can be used
  usedCount: { type: Number, default: 0 },
  maxRedemptionsPerUser: { type: Number, default: 1 }, // Per-user limit
  redeemedBy: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    redeemedAt: { type: Date, default: Date.now }
  }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Promo', PromoSchema);
