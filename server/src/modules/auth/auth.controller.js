const User = require('../users/user.model');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'customer',
      phone
    });

    const token = generateToken(user);

    res.status(201).json({
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
