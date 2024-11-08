// api/index.js
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

// Initialize express
const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://cheetah-test-app.vercel.app/' // Replace with your actual frontend URL
    : 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Helper function to connect to MongoDB
async function connectToMongo() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Please add your Mongo URI to .env');
  }
  const client = new MongoClient(uri);
  await client.connect();
  return client;
}

// Routes
app.post('/api/submit-survey', async (req, res) => {
  let client;
  try {
    client = await connectToMongo();
    const body = req.body;
    const database = client.db('survey_db');
    const surveys = database.collection('surveys');

    const surveyData = {
      ...body,
      submittedAt: new Date()
    };

    const result = await surveys.insertOne(surveyData);
    res.status(200).json({ message: 'Survey submitted successfully', id: result.insertedId });
  } catch (error) {
    console.error('Error submitting survey to MongoDB:', error);
    res.status(500).json({ message: 'Error submitting survey' });
  } finally {
    if (client) await client.close();
  }
});

app.post('/api/check-email', async (req, res) => {
  let client;
  try {
    client = await connectToMongo();
    const { email } = req.body;
    const database = client.db('survey_db');
    const surveys = database.collection('surveys');

    const existingSurvey = await surveys.findOne({ email });
    res.status(200).json({ exists: !!existingSurvey });
  } catch (error) {
    console.error('Error checking email in MongoDB:', error);
    res.status(500).json({ message: 'Error checking email' });
  } finally {
    if (client) await client.close();
  }
});

// Export the Express API
module.exports = app;