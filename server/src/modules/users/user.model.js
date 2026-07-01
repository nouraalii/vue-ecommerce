const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional if using Google OAuth
  googleId: { type: String },
  role: { type: String, enum: ['customer', 'seller', 'admin'], default: 'customer' },
  phone: { type: String },
  isEmailVerified: { type: Boolean, default: false },
  
  // Account Management
  accountStatus: { type: String, enum: ['active', 'restricted', 'deleted'], default: 'active' },
  deletedAt: { type: Date, default: null },

  // Addresses
  addresses: [{
    label: String, // e.g., "Home", "Work"
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    isDefault: Boolean
  }],

  // Role-specific extensions (Seller Profile)
  sellerDetails: {
    storeName: { type: String }, // Required if role === 'seller'
    description: String,
    logoUrl: String,
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'suspended'], default: 'pending' },
  },

  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  savedPaymentMethods: [{ /* Payment Method IDs */ }]
}, { timestamps: true });

// Password hashing middleware
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
