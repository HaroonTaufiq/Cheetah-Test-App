
const { MongoClient } = require('mongodb');

let client;

async function connectToMongo() {
  if (client) return client;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Please add your Mongo URI to .env');
  }
  
  client = new MongoClient(uri);
  await client.connect();
  return client;
}

module.exports = { connectToMongo };