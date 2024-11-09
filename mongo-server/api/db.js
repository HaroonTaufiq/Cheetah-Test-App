// db.js
const { MongoClient } = require('mongodb');
const logger = require('./utils/logger');

let client;

async function connectToMongo() {
  if (client?.topology?.isConnected?.()) return client;

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
    
    // Test connection
    await client.db().admin().ping();
    logger.info('Connected to MongoDB');
    return client;
  } catch (error) {
    logger.error(`MongoDB connection error: ${error.message}`);
    throw error;
  }
}

// Add connection close handler
async function closeConnection() {
  if (client) {
    await client.close();
    client = null;
    logger.info('MongoDB connection closed');
  }
}

module.exports = {
  connectToMongo,
  closeConnection
};