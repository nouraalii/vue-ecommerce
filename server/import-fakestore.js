require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');

// Models
const User = require('./src/modules/users/user.model');
const Category = require('./src/modules/products/category.model');
const Product = require('./src/modules/products/product.model');

mongoose.connect(process.env.MONGO_URI);

const importData = async () => {
  try {
    console.log('Fetching from FakeStore API...');
    const response = await axios.get('https://fakestoreapi.com/products');
    const fakeProducts = response.data;

    // Get the admin/seller to assign these products to
    const seller = await User.findOne({ role: 'seller' });
    if (!seller) {
      console.log('No seller found to assign products. Run seeder.js first.');
      process.exit(1);
    }

    console.log(`Found ${fakeProducts.length} products. Processing...`);

    // We need to map fakeStore categories to our DB Categories
    const categoriesMap = {};
    for (const fp of fakeProducts) {
      if (!categoriesMap[fp.category]) {
        let cat = await Category.findOne({ name: fp.category });
        if (!cat) {
          cat = await Category.create({ 
            name: fp.category, 
            slug: fp.category.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase(),
            description: `All products in ${fp.category}`
          });
        }
        categoriesMap[fp.category] = cat._id;
      }
    }

    // Map to our Product schema
    const newProducts = fakeProducts.map(fp => {
      // FakeStore rate out of 5, count up to 1000
      return {
        title: fp.title,
        slug: `fs-${fp.id}-${fp.title.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`,
        description: fp.description,
        seller: seller._id,
        category: categoriesMap[fp.category],
        images: [{ url: fp.image, alt: fp.title }],
        basePrice: fp.price,
        compareAtPrice: (fp.price * 1.2).toFixed(2), // 20% higher fake original price
        stock: Math.floor(Math.random() * 100) + 10,
        status: 'active',
        averageRating: fp.rating.rate,
        reviewCount: fp.rating.count
      };
    });

    await Product.insertMany(newProducts);
    console.log(`Successfully imported ${newProducts.length} real products from FakeStore!`);
    process.exit();
  } catch (err) {
    console.error('Error importing data:', err.message);
    process.exit(1);
  }
};

importData();
