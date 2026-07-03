const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional if using Google OAuth
  googleId: { type: String },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
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

  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  savedPaymentMethods: [{ /* Payment Method IDs */ }]
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
