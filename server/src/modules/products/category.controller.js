const Category = require('./category.model');

// @desc    Get all categories
// @route   GET /api/v1/categories
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate('parentCategory', 'name slug');
    res.status(200).json({ success: true, count: categories.length, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create category
// @route   POST /api/v1/categories
// @access  Private/Admin
exports.createCategory = async (req, res) => {
  try {
    const { name, slug, description, imageUrl, parentCategory } = req.body;
    
    // Check if slug exists
    const existing = await Category.findOne({ slug });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Category slug already exists' });
    }

    const category = await Category.create({
      name,
      slug,
      description,
      imageUrl,
      parentCategory: parentCategory || null
    });

    res.status(201).json({ success: true, data: category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
