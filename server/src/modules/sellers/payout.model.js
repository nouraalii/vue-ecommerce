const mongoose = require('mongoose');

const PayoutSchema = new mongoose.Schema({
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  periodStart: { type: Date, required: true },
  periodEnd: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'processing', 'paid', 'failed'], default: 'pending' },
  paidAt: { type: Date, default: null },
  referenceId: String // e.g., Bank transfer ID
}, { timestamps: true });

module.exports = mongoose.model('Payout', PayoutSchema);
