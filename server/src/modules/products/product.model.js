const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true, text: true }, // Text index for name search
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  brand: String,

  images: [{ url: String, alt: String }], // First image is primary

  // Pricing & Inventory
  basePrice: { type: Number, required: true },
  compareAtPrice: Number,
  stock: { type: Number, default: 0 },

  // Variants
  variants: [{
    name: String,
    sku: String,
    priceAdjustment: { type: Number, default: 0 },
    stock: { type: Number, default: 0 }
  }],

  // Metadata
  status: { type: String, enum: ['draft', 'pending_approval', 'active', 'rejected', 'archived'], default: 'pending_approval' },
  tags: { type: [String], index: true }, // Index for tags search

  // Denormalized stats
  averageRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 }
}, { timestamps: true });

// Compound text index (optional, but requested title + tags + description)
ProductSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Product', ProductSchema);
