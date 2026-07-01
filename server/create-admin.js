require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/modules/users/user.model');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existingAdmin = await User.findOne({ email: 'admin@test.com' });
    if (existingAdmin) {
      console.log('Admin already exists.');
      process.exit(0);
    }

    await User.create({
      name: 'Super Admin',
      email: 'admin@test.com',
      password: 'password123',
      role: 'admin',
      accountStatus: 'active'
    });

    console.log('Admin account created successfully!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createAdmin();
