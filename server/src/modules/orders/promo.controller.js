const Promo = require('./promo.model');

const normalizeCode = code => String(code || '').trim().toUpperCase();

// @desc    Get all promo codes
// @route   GET /api/v1/promos
// @access  Private/Admin
exports.getPromos = async (req, res) => {
  try {
    const promos = await Promo.find().sort('-createdAt');
    res.status(200).json({ success: true, count: promos.length, data: promos });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create promo code
// @route   POST /api/v1/promos
// @access  Private/Admin
exports.createPromo = async (req, res) => {
  try {
    const { code, discountPercentage, isActive, expiresAt } = req.body;

    const normalizedCode = normalizeCode(code);
    if (!normalizedCode) {
      return res.status(400).json({ success: false, message: 'Promo code is required' });
    }

    const discount = Number(discountPercentage);
    if (!Number.isFinite(discount) || discount < 1 || discount > 100) {
      return res.status(400).json({ success: false, message: 'Discount must be between 1 and 100' });
    }

    const existing = await Promo.findOne({ code: normalizedCode });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Promo code already exists' });
    }

    const promo = await Promo.create({
      code: normalizedCode,
      discountPercentage: discount,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      expiresAt: expiresAt || undefined
    });

    res.status(201).json({ success: true, data: promo });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update promo code
// @route   PUT /api/v1/promos/:id
// @access  Private/Admin
exports.updatePromo = async (req, res) => {
  try {
    const { code, discountPercentage, isActive, expiresAt } = req.body;
    const update = {};

    if (code !== undefined) {
      const normalizedCode = normalizeCode(code);
      if (!normalizedCode) {
        return res.status(400).json({ success: false, message: 'Promo code cannot be empty' });
      }

      const existing = await Promo.findOne({ code: normalizedCode, _id: { $ne: req.params.id } });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Promo code already exists' });
      }
      update.code = normalizedCode;
    }

    if (discountPercentage !== undefined) {
      const discount = Number(discountPercentage);
      if (!Number.isFinite(discount) || discount < 1 || discount > 100) {
        return res.status(400).json({ success: false, message: 'Discount must be between 1 and 100' });
      }
      update.discountPercentage = discount;
    }

    if (isActive !== undefined) update.isActive = Boolean(isActive);
    if (expiresAt !== undefined) update.expiresAt = expiresAt || null;

    const promo = await Promo.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true
    });

    if (!promo) {
      return res.status(404).json({ success: false, message: 'Promo not found' });
    }

    res.status(200).json({ success: true, data: promo });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete promo code
// @route   DELETE /api/v1/promos/:id
// @access  Private/Admin
exports.deletePromo = async (req, res) => {
  try {
    const promo = await Promo.findByIdAndDelete(req.params.id);

    if (!promo) {
      return res.status(404).json({ success: false, message: 'Promo not found' });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
