const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const mongoose = require('mongoose');
const connectDB = require('./src/config/db');
const Category = require('./src/modules/products/category.model');
const Product = require('./src/modules/products/product.model');

// Real, high-quality catalog with stable Unsplash image URLs (pinned params).
// Re-running this script upserts by slug, so it never creates duplicates.
const CATEGORY_IMAGES = {
  Footwear: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80',
  Electronics: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=600&q=80',
  Accessories: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
  Home: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=600&q=80',
  Apparel: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=600&q=80'
};

const products = [
  // Footwear
  { title: 'Nike Air Max 270', category: 'Footwear', price: 150, compareAt: 180, stock: 60, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', description: 'Classic Air Max style with the largest Max Air unit yet for all-day comfort.' },
  { title: 'Adidas Ultraboost 22', category: 'Footwear', price: 190, compareAt: 220, stock: 45, image: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&w=800&q=80', description: 'Responsive Boost cushioning and a Primeknit upper for a locked-in fit.' },
  { title: 'Converse Chuck 70 High', category: 'Footwear', price: 85, compareAt: 95, stock: 80, image: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=800&q=80', description: 'A premium take on the original with vintage details and extra cushioning.' },
  { title: 'New Balance 550', category: 'Footwear', price: 120, stock: 50, image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80', description: 'A retro basketball silhouette reborn with clean leather panelling.' },
  { title: 'Vans Old Skool', category: 'Footwear', price: 70, stock: 90, image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80', description: 'The iconic side-stripe skate shoe with a durable suede and canvas upper.' },

  // Electronics
  { title: 'Apple Watch Series 9', category: 'Electronics', price: 399, compareAt: 429, stock: 40, image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=800&q=80', description: 'The ultimate device for a healthy life with an even brighter display.' },
  { title: 'Sony Alpha a7 III', category: 'Electronics', price: 1998, stock: 15, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80', description: 'Full-frame mirrorless interchangeable-lens camera with pro-grade autofocus.' },
  { title: 'Beats Studio Pro', category: 'Electronics', price: 349, compareAt: 399, stock: 55, image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80', description: 'Premium wireless noise-cancelling headphones with rich, balanced sound.' },
  { title: 'Mechanical RGB Keyboard', category: 'Electronics', price: 130, stock: 70, image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80', description: 'RGB mechanical gaming keyboard with tactile, clicky switches.' },
  { title: 'Nintendo Switch OLED', category: 'Electronics', price: 349, stock: 35, image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80', description: 'Play at home or on-the-go with a vibrant 7-inch OLED screen.' },
  { title: 'Bose SoundLink Speaker', category: 'Electronics', price: 129, compareAt: 149, stock: 65, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80', description: 'Portable Bluetooth speaker with deep, loud sound and rugged build.' },
  { title: 'DJI Mini 3 Drone', category: 'Electronics', price: 469, stock: 20, image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=800&q=80', description: 'Ultralight 4K camera drone that fits in the palm of your hand.' },

  // Accessories
  { title: 'Premium Leather Backpack', category: 'Accessories', price: 120, compareAt: 160, stock: 40, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80', description: 'Durable full-grain leather backpack with a padded laptop compartment.' },
  { title: 'Ray-Ban Aviator Classic', category: 'Accessories', price: 160, stock: 75, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80', description: 'One of the most iconic sunglass models in the world.' },
  { title: 'Minimalist Analog Watch', category: 'Accessories', price: 199, compareAt: 249, stock: 50, image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80', description: 'A clean, minimalist wristwatch with a genuine leather strap.' },
  { title: 'Leather Bifold Wallet', category: 'Accessories', price: 45, stock: 120, image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80', description: 'Slim hand-stitched leather wallet with RFID-blocking card slots.' },
  { title: 'Canvas Weekender Bag', category: 'Accessories', price: 89, stock: 60, image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=800&q=80', description: 'Water-resistant waxed-canvas duffel, perfect for short getaways.' },

  // Home
  { title: 'Yeti Rambler Tumbler', category: 'Home', price: 35, stock: 150, image: 'https://images.unsplash.com/photo-1614806687038-db8b7fa98894?auto=format&fit=crop&w=800&q=80', description: 'Stainless-steel vacuum-insulated tumbler that keeps drinks cold for hours.' },
  { title: 'Scandinavian Table Lamp', category: 'Home', price: 79, compareAt: 99, stock: 45, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80', description: 'Warm ambient lighting in a timeless Scandinavian oak-and-linen design.' },
  { title: 'Ceramic Pour-Over Set', category: 'Home', price: 54, stock: 70, image: 'https://images.unsplash.com/photo-1517914309068-99666bc5b45d?auto=format&fit=crop&w=800&q=80', description: 'Hand-glazed ceramic dripper and carafe for the perfect morning brew.' },
  { title: 'Wool Throw Blanket', category: 'Home', price: 68, stock: 85, image: 'https://images.unsplash.com/photo-1600369671236-e74521d4b6ad?auto=format&fit=crop&w=800&q=80', description: 'Soft, chunky-knit wool blend throw to layer over any sofa or bed.' },
  { title: 'Indoor Plant Pot Set', category: 'Home', price: 42, stock: 100, image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80', description: 'Set of three matte-finish ceramic planters with drainage trays.' },

  // Apparel
  { title: 'Organic Cotton Tee', category: 'Apparel', price: 29, stock: 200, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80', description: 'Everyday essential tee in soft, breathable 100% organic cotton.' },
  { title: 'Merino Wool Sweater', category: 'Apparel', price: 118, compareAt: 140, stock: 55, image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=800&q=80', description: 'Lightweight, temperature-regulating merino crewneck sweater.' },
  { title: 'Classic Denim Jacket', category: 'Apparel', price: 89, stock: 65, image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80', description: 'Timeless washed-denim trucker jacket that pairs with everything.' },
  { title: 'Tailored Chino Pants', category: 'Apparel', price: 72, stock: 90, image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80', description: 'Slim-fit stretch chinos cut for comfort from desk to dinner.' },
  { title: 'Packable Rain Shell', category: 'Apparel', price: 135, compareAt: 165, stock: 40, image: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=800&q=80', description: 'Waterproof, breathable shell that packs into its own chest pocket.' }
];

const slugify = value => value.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase();

const seed = async () => {
  await connectDB();

  const categoryCache = new Map();

  const getCategory = async name => {
    if (categoryCache.has(name)) return categoryCache.get(name);

    const slug = slugify(name);
    const category = await Category.findOneAndUpdate(
      { slug },
      { $setOnInsert: { name, slug, imageUrl: CATEGORY_IMAGES[name], status: 'active' } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    categoryCache.set(name, category);
    return category;
  };

  let created = 0;
  let updated = 0;

  for (const item of products) {
    const category = await getCategory(item.category);
    const slug = slugify(item.title);

    const payload = {
      title: item.title,
      description: item.description,
      category: category._id,
      images: [{ url: item.image, alt: item.title }],
      basePrice: item.price,
      stock: item.stock,
      status: 'active',
      averageRating: Number((Math.random() * 1 + 4).toFixed(1)), // 4.0 - 5.0
      reviewCount: Math.floor(Math.random() * 200) + 20
    };

    if (item.compareAt) payload.compareAtPrice = item.compareAt;

    const result = await Product.updateOne(
      { slug },
      { $set: payload, $setOnInsert: { slug } },
      { upsert: true }
    );

    if (result.upsertedCount) created += 1;
    else updated += 1;
  }

  console.log(`Seed complete. Products created: ${created}, updated: ${updated}, categories: ${categoryCache.size}`);
  await mongoose.disconnect();
};

seed().catch(async error => {
  console.error(`Seed failed: ${error.message}`);
  await mongoose.disconnect();
  process.exit(1);
});
