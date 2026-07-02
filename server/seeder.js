const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const connectDB = require('./src/config/db');

const Category = require('./src/modules/products/category.model');
const Product = require('./src/modules/products/product.model');

const mockCategories = [
  { name: 'Electronics', slug: 'electronics', description: 'Gadgets and devices' },
  { name: 'Fashion', slug: 'fashion', description: 'Clothing and accessories' },
  { name: 'Home & Living', slug: 'home-living', description: 'Furniture and decor' }
];

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Category.deleteMany();
    await Product.deleteMany();
    console.log('Data cleared...');

    // Create categories
    const createdCategories = await Category.insertMany(mockCategories);

    const mockProducts = [
      {
        title: 'Sony WH-1000XM5 Wireless Headphones',
        slug: 'sony-wh-1000xm5',
        description: 'Industry leading noise canceling with two processors control 8 microphones for unprecedented noise canceling. With Auto NC Optimizer, noise canceling is automatically optimized based on your wearing conditions and environment.',
        category: createdCategories[0]._id, // Electronics
        images: [{ url: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'Headphones' }],
        basePrice: 348.00,
        compareAtPrice: 399.00,
        stock: 45,
        status: 'active',
        averageRating: 4.8,
        reviewCount: 124
      },
      {
        title: 'Apple MacBook Pro 14-inch (M3 Pro)',
        slug: 'apple-macbook-pro-14',
        description: 'The 14-inch MacBook Pro blasts forward with M3 Pro and M3 Max, radically advanced chips that drive even greater performance for more demanding workflows.',
        category: createdCategories[0]._id, // Electronics
        images: [{ url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'MacBook' }],
        basePrice: 1999.00,
        stock: 12,
        status: 'active',
        averageRating: 4.9,
        reviewCount: 89
      },
      {
        title: 'Minimalist Ceramic Coffee Mug',
        slug: 'minimalist-ceramic-mug',
        description: 'Start your morning right with this beautifully crafted, handcrafted ceramic mug. Perfect for coffee, tea, or any hot beverage.',
        category: createdCategories[2]._id, // Home & Living
        images: [{ url: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'Mug' }],
        basePrice: 24.99,
        stock: 150,
        status: 'active',
        averageRating: 4.5,
        reviewCount: 42
      },
      {
        title: 'Classic Denim Jacket',
        slug: 'classic-denim-jacket',
        description: 'A timeless staple for any wardrobe. This classic denim jacket is made from 100% heavyweight cotton and features durable metal button closures.',
        category: createdCategories[1]._id, // Fashion
        images: [{ url: 'https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'Jacket' }],
        basePrice: 89.99,
        compareAtPrice: 120.00,
        stock: 30,
        status: 'active',
        averageRating: 4.6,
        reviewCount: 215
      },
      {
        title: 'Smart Home Security Camera',
        slug: 'smart-home-camera',
        description: 'Keep your home safe with 1080p HD video, two-way audio, and motion detection alerts straight to your phone.',
        category: createdCategories[0]._id, // Electronics
        images: [{ url: 'https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'Camera' }],
        basePrice: 129.99,
        stock: 0, // Out of stock
        status: 'active',
        averageRating: 4.2,
        reviewCount: 56
      }
    ];

    await Product.insertMany(mockProducts);
    console.log('Mock Data Imported!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
