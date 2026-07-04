const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

// Stripe webhook must receive the raw request body for signature verification,
// so it is mounted BEFORE the JSON body parser below.
const { stripeWebhook } = require('./modules/payments/payment.controller');
app.post('/api/v1/payments/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./modules/auth/auth.route');
const productRoutes = require('./modules/products/product.route');
const categoryRoutes = require('./modules/products/category.route');
const orderRoutes = require('./modules/orders/order.route');
const promoRoutes = require('./modules/orders/promo.route');
const paymentRoutes = require('./modules/payments/payment.route');
const userRoutes = require('./modules/users/user.route');
const wishlistRoutes = require('./modules/wishlist/wishlist.route');
const reviewRoutes = require('./modules/reviews/review.route');
const cartRoutes = require('./modules/cart/cart.route');

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/promos', promoRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/wishlist', wishlistRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/cart', cartRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Server Error' });
});

module.exports = app;
