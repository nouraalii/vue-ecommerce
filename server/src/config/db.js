const mongoose = require('mongoose');
const dns = require('dns');

const connectDB = async () => {
  try {
    const { MONGO_URI, MONGODB_DB_NAME, MONGO_DNS_SERVERS } = process.env;

    if (!MONGO_URI) {
      throw new Error('MONGO_URI is missing from environment variables');
    }

    if (MONGO_DNS_SERVERS) {
      dns.setServers(MONGO_DNS_SERVERS.split(',').map(server => server.trim()).filter(Boolean));
    }

    const conn = await mongoose.connect(MONGO_URI, {
      dbName: MONGODB_DB_NAME || undefined,
      serverSelectionTimeoutMS: 15000,
    });

    try {
      const usersCollection = conn.connection.collection('users');
      const indexes = await usersCollection.indexes();
      const stalePhoneIndex = indexes.find(index => index.name === 'phone_1' && index.unique);

      if (stalePhoneIndex) {
        await usersCollection.dropIndex('phone_1');
        console.log('Dropped stale unique users.phone index');
      }
    } catch (indexError) {
      if (indexError.codeName !== 'NamespaceNotFound' && indexError.codeName !== 'IndexNotFound') {
        throw indexError;
      }
    }

    console.log(`MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
