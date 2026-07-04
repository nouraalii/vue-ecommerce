const Product = require('./product.model');

// @desc    Get all products (with search, filter, pagination)
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit', 'keyword'];
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Parse back to JSON
    let parsedQuery = JSON.parse(queryStr);

    // Text Search / Keyword
    if (req.query.keyword) {
      parsedQuery.$text = { $search: req.query.keyword };
    }

    const includeAllStatuses = parsedQuery.status === 'all';

    if (includeAllStatuses) {
      delete parsedQuery.status;
    }

    // Default to active products only
    if (!includeAllStatuses && !parsedQuery.status) {
      parsedQuery.status = 'active';
    }

    // Finding resource
    query = Product.find(parsedQuery).populate('category', 'name slug');

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt'); // Default sort
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Product.countDocuments(parsedQuery);

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const products = await query;

    // Pagination result
    const pagination = {};
    if (endIndex < total) {
      pagination.next = { page: page + 1, limit };
    }
    if (startIndex > 0) {
      pagination.prev = { page: page - 1, limit };
    }

    res.status(200).json({
      success: true,
      count: products.length,
      pagination,
      total,
      data: products
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update product
// @route   PUT /api/v1/products/:id
// @access  Private/Admin/Seller
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Seller ownership check
    if (req.user.role === 'seller' && product.seller && product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this product' });
    }

    if (req.user.role === 'seller') {
      req.body.seller = req.user._id;
      // Allow sellers to set to active directly for convenience, or default to pending
      if (!req.body.status) {
        req.body.status = 'active';
      }
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('category', 'name slug');

    res.status(200).json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Archive product
// @route   DELETE /api/v1/products/:id
// @access  Private/Admin/Seller
exports.archiveProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Seller ownership check
    if (req.user.role === 'seller' && product.seller && product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this product' });
    }

    product.status = 'archived';
    await product.save();

    res.status(200).json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get single product
// @route   GET /api/v1/products/:id
// @access  Public
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug');
      
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create product
// @route   POST /api/v1/products
// @access  Private/Admin/Seller
exports.createProduct = async (req, res) => {
  try {
    if (req.user.role === 'seller') {
      req.body.seller = req.user._id;
      // Auto-approve seller products for standard demo or allow draft/active
      if (!req.body.status) {
        req.body.status = 'active';
      }
    }
    const product = await Product.create(req.body);

    res.status(201).json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
