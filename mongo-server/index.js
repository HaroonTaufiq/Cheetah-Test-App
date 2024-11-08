const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;
const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('Please add your Mongo URI to .env');
}

// Use CORS middleware
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your front-end URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

app.post('/submit-survey', async (req, res) => {
  const client = new MongoClient(uri);
  try {
    const body = req.body;
    await client.connect();
    console.log("Connected to MongoDB");
    const database = client.db('survey_db');
    const surveys = database.collection('surveys');

    // Add a timestamp to the survey data
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
    await client.close();
  }
});

app.post('/check-email', async (req, res) => {
  const client = new MongoClient(uri);
  try {
    const { email } = req.body;
    await client.connect();
    const database = client.db('survey_db');
    const surveys = database.collection('surveys');

    const existingSurvey = await surveys.findOne({ email });

    if (existingSurvey) {
      res.status(200).json({ exists: true });
    } else {
      res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error('Error checking email in MongoDB:', error);
    res.status(500).json({ message: 'Error checking email' });
  } finally {
    await client.close();
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});