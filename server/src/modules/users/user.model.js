const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional if using Google OAuth
  googleId: { type: String },
  role: { type: String, enum: ['customer', 'admin', 'seller'], default: 'customer' },
  phone: { type: String },
  isEmailVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String },
  emailVerificationExpires: { type: Date },
  
  // Seller Profile fields
  sellerProfile: {
    storeName: { type: String },
    description: { type: String },
    balance: { type: Number, default: 0 },
    earnings: { type: Number, default: 0 },
    payouts: [{
      amount: { type: Number, required: true },
      status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
      requestedAt: { type: Date, default: Date.now }
    }]
  },
  
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

  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  savedPaymentMethods: [{
    cardHolder: String,
    last4: String,
    expiryMonth: Number,
    expiryYear: Number,
    brand: String
  }]
}, { timestamps: true });

// Password hashing middleware
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const saltRounds = Number(process.env.SALT_ROUNDS) || 10;
  const salt = await bcrypt.genSalt(saltRounds);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
