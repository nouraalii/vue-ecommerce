const Stripe = require('stripe');
const Order = require('../orders/order.model');
const { getPromoDetails, prepareOrderItems, computeTotals } = require('../orders/order.service');

const stripe = process.env.STRIPE_SECRET_KEY ? Stripe(process.env.STRIPE_SECRET_KEY) : null;

const clientUrl = () => process.env.CLIENT_URL || 'http://localhost:5173';

// Stripe works in the smallest currency unit (cents).
const toCents = amount => Math.round(Number(amount) * 100);

// @desc    Create a Stripe Checkout Session for a new order
// @route   POST /api/v1/payments/create-checkout-session
// @access  Private
exports.createCheckoutSession = async (req, res) => {
  try {
    if (!stripe) {
      return res.status(503).json({ success: false, message: 'Stripe is not configured on the server' });
    }

    const { orderItems, shippingAddress, taxPrice, shippingPrice, promoCode } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items' });
    }

    const mappedShippingAddress = {
      street: shippingAddress.address,
      city: shippingAddress.city,
      zipCode: shippingAddress.postalCode,
      country: shippingAddress.country
    };

    const appliedPromo = await getPromoDetails(promoCode);
    if (promoCode && !appliedPromo) {
      return res.status(400).json({ success: false, message: 'Invalid or expired promo code' });
    }

    // Validate against DB (also decrements stock) and compute authoritative totals.
    const { finalOrderItems, subTotal } = await prepareOrderItems(orderItems);
    const { appliedDiscount, totalAmount } = computeTotals({ subTotal, taxPrice, shippingPrice, appliedPromo });

    const order = await Order.create({
      customer: req.user.id,
      items: finalOrderItems,
      shippingAddress: mappedShippingAddress,
      paymentMethod: 'stripe',
      subTotal,
      tax: taxPrice,
      shippingPrice,
      promoCode: appliedPromo ? appliedPromo.code : undefined,
      discountAmount: appliedDiscount,
      totalAmount,
      paymentStatus: 'pending',
      orderStatus: 'placed'
    });

    // Build Stripe line items from the DB-validated order.
    // The promo discount, tax, and shipping are collapsed into a single
    // adjustment line so the Stripe total always matches order.totalAmount.
    const lineItems = finalOrderItems.map(item => ({
      quantity: item.quantity,
      price_data: {
        currency: 'usd',
        unit_amount: toCents(item.price),
        product_data: { name: item.name }
      }
    }));

    const adjustment = Number(((taxPrice || 0) + (shippingPrice || 0) - appliedDiscount).toFixed(2));
    if (adjustment > 0) {
      lineItems.push({
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: toCents(adjustment),
          product_data: { name: 'Tax & shipping (less discount)' }
        }
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      client_reference_id: order._id.toString(),
      metadata: { orderId: order._id.toString() },
      success_url: `${clientUrl()}/order-success/${order._id}`,
      cancel_url: `${clientUrl()}/checkout`
    });

    order.paymentProviderRef = session.id;
    await order.save();

    res.status(200).json({ success: true, data: { url: session.url, orderId: order._id } });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Stripe webhook — source of truth for payment status
// @route   POST /api/v1/payments/webhook
// @access  Public (verified via Stripe signature)
exports.stripeWebhook = async (req, res) => {
  if (!stripe) {
    return res.status(503).send('Stripe is not configured');
  }

  const signature = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;

  try {
    // req.body is a raw Buffer here (see the express.raw mount in app.js).
    event = webhookSecret
      ? stripe.webhooks.constructEvent(req.body, signature, webhookSecret)
      : JSON.parse(req.body.toString());
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const orderId = session.metadata?.orderId || session.client_reference_id;

      if (orderId) {
        await Order.findByIdAndUpdate(orderId, {
          paymentStatus: 'paid',
          paymentProviderRef: session.payment_intent || session.id
        });
      }
    }

    res.status(200).json({ received: true });
  } catch (err) {
    res.status(500).send(`Webhook handler failed: ${err.message}`);
  }
};
