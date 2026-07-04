const User = require('../users/user.model');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../../utils/email');

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, role = 'customer', storeName, storeDescription } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const emailVerificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    const emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    const userObj = {
      name,
      email,
      password,
      phone,
      role: ['customer', 'seller'].includes(role) ? role : 'customer',
      emailVerificationToken,
      emailVerificationExpires,
      isEmailVerified: false
    };

    if (role === 'seller') {
      userObj.sellerProfile = {
        storeName: storeName || `${name}'s Store`,
        description: storeDescription || '',
        balance: 0,
        earnings: 0,
        payouts: []
      };
    }

    const user = await User.create(userObj);

    const token = generateToken(user);

    // Send verification email
    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px;">
        <h2 style="color: #4f46e5; text-align: center; margin-bottom: 24px;">Verify Your Email Address</h2>
        <p>Hi <strong>${user.name}</strong>,</p>
        <p>Thank you for registering at our store! To complete your registration and activate your account, please enter the following 6-digit verification code:</p>
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 12px; margin: 24px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #111827;">${emailVerificationToken}</span>
        </div>
        <p style="font-size: 14px; color: #6b7280; text-align: center;">This code is valid for 24 hours.</p>
        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p>Best regards,<br>The eShop Team</p>
      </div>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: 'Confirm Your Email Verification Code',
        html: emailHtml
      });
    } catch (err) {
      console.error('Failed to send verification email:', err);
    }

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide an email and password' });
    }

    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (user.accountStatus === 'restricted' || user.accountStatus === 'deleted') {
      return res.status(403).json({ success: false, message: 'Your account is restricted or deleted' });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, addresses } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (addresses) user.addresses = addresses;
    
    await user.save();
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPaymentMethods = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('savedPaymentMethods');
    res.status(200).json({ success: true, data: user.savedPaymentMethods });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addPaymentMethod = async (req, res) => {
  try {
    const { cardHolder, last4, expiryMonth, expiryYear, brand } = req.body;
    const user = await User.findById(req.user._id);
    
    user.savedPaymentMethods.push({ cardHolder, last4, expiryMonth, expiryYear, brand });
    await user.save();
    
    res.status(200).json({ success: true, data: user.savedPaymentMethods });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.removePaymentMethod = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.savedPaymentMethods = user.savedPaymentMethods.filter(
      method => method._id.toString() !== req.params.methodId
    );
    await user.save();
    
    res.status(200).json({ success: true, data: user.savedPaymentMethods });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Google Login / Registration (simulated or real)
// @route   POST /api/v1/auth/google-login
// @access  Public
exports.googleLogin = async (req, res) => {
  try {
    const { email, name, googleId } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId,
        isEmailVerified: true,
        role: 'customer',
        accountStatus: 'active'
      });
    } else {
      if (!user.googleId) {
        user.googleId = googleId;
      }
      user.isEmailVerified = true;
      await user.save();
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify email with 6-digit code
// @route   POST /api/v1/auth/verify-email
// @access  Public
exports.verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ success: false, message: 'Please provide email and verification code' });
    }

    const user = await User.findOne({
      email,
      emailVerificationToken: code,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired verification code' });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Resend email verification code
// @route   POST /api/v1/auth/resend-verification
// @access  Public
exports.resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ success: false, message: 'Email is already verified' });
    }

    const emailVerificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    const emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;

    user.emailVerificationToken = emailVerificationToken;
    user.emailVerificationExpires = emailVerificationExpires;
    await user.save();

    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px;">
        <h2 style="color: #4f46e5; text-align: center; margin-bottom: 24px;">Verify Your Email Address</h2>
        <p>Hi <strong>${user.name}</strong>,</p>
        <p>Here is your new 6-digit email verification code:</p>
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 12px; margin: 24px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #111827;">${emailVerificationToken}</span>
        </div>
        <p style="font-size: 14px; color: #6b7280; text-align: center;">This code is valid for 24 hours.</p>
        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p>Best regards,<br>The eShop Team</p>
      </div>
    `;

    await sendEmail({
      to: user.email,
      subject: 'New Email Verification Code',
      html: emailHtml
    });

    res.status(200).json({ success: true, message: 'Verification code resent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upgrade standard customer account to seller account
// @route   POST /api/v1/auth/upgrade-seller
// @access  Private
exports.upgradeSeller = async (req, res) => {
  try {
    const { storeName, storeDescription } = req.body;

    if (!storeName) {
      return res.status(400).json({ success: false, message: 'Store name is required' });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.role = 'seller';
    user.sellerProfile = {
      storeName,
      description: storeDescription || '',
      balance: user.sellerProfile?.balance || 0,
      earnings: user.sellerProfile?.earnings || 0,
      payouts: user.sellerProfile?.payouts || []
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Account upgraded to Seller successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Seller metrics/stats
// @route   GET /api/v1/auth/me/seller-stats
// @access  Private/Seller
exports.getSellerStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || user.role !== 'seller') {
      return res.status(403).json({ success: false, message: 'Not authorized as a seller' });
    }

    const Product = require('../products/product.model');
    const productCount = await Product.countDocuments({ seller: req.user._id });

    res.status(200).json({
      success: true,
      data: {
        storeName: user.sellerProfile?.storeName,
        description: user.sellerProfile?.description,
        balance: user.sellerProfile?.balance || 0,
        earnings: user.sellerProfile?.earnings || 0,
        payouts: user.sellerProfile?.payouts || [],
        productCount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Request a payout
// @route   POST /api/v1/auth/me/request-payout
// @access  Private/Seller
exports.requestPayout = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || user.role !== 'seller') {
      return res.status(403).json({ success: false, message: 'Not authorized as a seller' });
    }

    const balance = user.sellerProfile?.balance || 0;
    if (balance <= 0) {
      return res.status(400).json({ success: false, message: 'No available balance to request payout' });
    }

    user.sellerProfile.payouts.push({
      amount: balance,
      status: 'pending',
      requestedAt: new Date()
    });
    user.sellerProfile.balance = 0;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Payout requested successfully',
      data: user.sellerProfile
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
