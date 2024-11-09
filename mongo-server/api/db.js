// db.js
const { MongoClient } = require('mongodb');
const logger = require('./utils/logger');

let client;

async function connectToMongo() {
  if (client && client.isConnected()) return client;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Please add your Mongo URI to .env');
  }
  
  try {
    client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
    logger.info('Connected to MongoDB');
    return client;
  } catch (error) {
    logger.error(`MongoDB connection error: ${error.message}`);
    throw error;
  }
}

process.on('SIGINT', async () => {
  if (client) {
    await client.close();
    logger.info('MongoDB connection closed through app termination');
    process.exit(0);
  }
});

module.exports = { connectToMongo };