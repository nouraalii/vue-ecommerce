const Product = require('../products/product.model');
const Promo = require('./promo.model');

const normalizePromoCode = code => String(code || '').trim().toUpperCase();

// Resolve a promo code to its discount details, or null if invalid/expired.
const getPromoDetails = async code => {
  const normalizedCode = normalizePromoCode(code);

  if (!normalizedCode) return null;

  // Legacy built-in demo code kept for backward compatibility.
  if (normalizedCode === 'VUE20') {
    return { code: 'VUE20', discountType: 'percentage', discountValue: 20 };
  }

  const promo = await Promo.findOne({ code: normalizedCode });

  if (!promo || !promo.isActive) return null;
  if (promo.expiresAt && promo.expiresAt < new Date()) return null;

  return { code: promo.code, discountType: 'percentage', discountValue: promo.discountPercentage };
};

const calculateDiscountAmount = (promo, subTotal = 0) => {
  if (!promo) return 0;

  if (promo.discountType === 'fixed_amount') {
    return Math.min(Number(promo.discountValue) || 0, subTotal);
  }

  return Math.min(subTotal * ((Number(promo.discountValue) || 0) / 100), subTotal);
};

const buildPromoResponse = (promo, subTotal = 0) => ({
  ...promo,
  discountAmount: Number(calculateDiscountAmount(promo, subTotal).toFixed(2))
});

// Validate cart items against the DB, decrement stock, and return the priced
// order items plus subtotal. Throws on missing product or insufficient stock.
const prepareOrderItems = async orderItems => {
  let subTotal = 0;
  const finalOrderItems = [];

  for (const item of orderItems) {
    const product = await Product.findById(item.product);

    if (!product) {
      throw new Error(`Product not found: ${item.product}`);
    }
    if (product.stock < item.quantity) {
      throw new Error(`Insufficient stock for ${product.title}`);
    }

    subTotal += product.basePrice * item.quantity;

    finalOrderItems.push({
      product: product._id,
      name: product.title,
      quantity: item.quantity,
      price: product.basePrice
    });

    product.stock -= item.quantity;
    await product.save();
  }

  return { finalOrderItems, subTotal };
};

const computeTotals = ({ subTotal, taxPrice = 0, shippingPrice = 0, appliedPromo }) => {
  const appliedDiscount = Number(calculateDiscountAmount(appliedPromo, subTotal).toFixed(2));
  const totalAmount = subTotal + (taxPrice || 0) + (shippingPrice || 0) - appliedDiscount;
  return { appliedDiscount, totalAmount };
};

module.exports = {
  normalizePromoCode,
  getPromoDetails,
  calculateDiscountAmount,
  buildPromoResponse,
  prepareOrderItems,
  computeTotals
};
