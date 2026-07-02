const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const connectDB = require('./src/config/db');
const Category = require('./src/modules/products/category.model');
const Product = require('./src/modules/products/product.model');

const premiumProducts = [
  { title: "Nike Air Max 270", category: "Footwear", price: 150, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", description: "Classic Air Max style with the largest Max Air unit yet." },
  { title: "Apple Watch Series 9", category: "Electronics", price: 399, image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", description: "The ultimate device for a healthy life." },
  { title: "Premium Leather Backpack", category: "Accessories", price: 120, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", description: "Durable and stylish leather backpack." },
  { title: "Sony Alpha a7 III", category: "Electronics", price: 1998, image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", description: "Full-frame mirrorless interchangeable lens camera." },
  { title: "Ray-Ban Aviator", category: "Accessories", price: 160, image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", description: "Currently one of the most iconic sunglass models in the world." },
  { title: "Beats Studio Pro", category: "Electronics", price: 349, image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", description: "Premium wireless noise cancelling headphones." },
  { title: "Mechanical Keyboard", category: "Electronics", price: 130, image: "https://images.unsplash.com/photo-1595225476474-87563907a212?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", description: "RGB mechanical gaming keyboard with clicky switches." },
  { title: "Yeti Rambler", category: "Home", price: 35, image: "https://images.unsplash.com/photo-1614806687038-db8b7fa98894?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", description: "Stainless steel vacuum insulated tumbler." },
  { title: "Nike Joyride", category: "Footwear", price: 140, image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", description: "Cushioning innovation delivering a personalized underfoot experience." },
  { title: "Nintendo Switch OLED", category: "Electronics", price: 349, image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", description: "Play at home on the TV or on-the-go with a vibrant 7-inch OLED screen." },
];

const importData = async () => {
  try {
    await connectDB();
    
    for (const prod of premiumProducts) {
      let cat = await Category.findOne({ name: prod.category });
      if (!cat) {
        cat = await Category.create({ name: prod.category, slug: prod.category.toLowerCase() });
      }
      
      await Product.create({
        title: prod.title,
        slug: prod.title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase(),
        description: prod.description,
        category: cat._id,
        images: [{ url: prod.image, alt: prod.title }],
        basePrice: prod.price,
        stock: 50,
        status: 'active',
        averageRating: 4.8,
        reviewCount: Math.floor(Math.random() * 200) + 20
      });
    }

    console.log('Premium data imported successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

importData();
