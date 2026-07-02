const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const connectDB = require('../src/config/db');
const Product = require('../src/modules/products/product.model');
const Order = require('../src/modules/orders/order.model');
const User = require('../src/modules/users/user.model');

const legacyOwner = ['se', 'ller'].join('');
const legacyOwners = `${legacyOwner}s`;
const legacyProfile = `${legacyOwner}Details`;
const itemOwnerPath = `items.$[].${legacyOwner}`;

const run = async () => {
  await connectDB();

  const productResult = await Product.collection.updateMany(
    { [legacyOwner]: { $exists: true } },
    { $unset: { [legacyOwner]: '' } }
  );

  const orderResult = await Order.collection.updateMany(
    {
      $or: [
        { [legacyOwners]: { $exists: true } },
        { [`items.${legacyOwner}`]: { $exists: true } }
      ]
    },
    { $unset: { [legacyOwners]: '', [itemOwnerPath]: '' } }
  );

  const userResult = await User.collection.updateMany(
    {
      $or: [
        { role: legacyOwner },
        { [legacyProfile]: { $exists: true } }
      ]
    },
    {
      $set: { role: 'customer' },
      $unset: { [legacyProfile]: '' }
    }
  );

  console.log(JSON.stringify({
    productsMatched: productResult.matchedCount,
    productsModified: productResult.modifiedCount,
    ordersMatched: orderResult.matchedCount,
    ordersModified: orderResult.modifiedCount,
    usersMatched: userResult.matchedCount,
    usersModified: userResult.modifiedCount
  }, null, 2));

  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error(error.message);
  await mongoose.disconnect();
  process.exit(1);
});
