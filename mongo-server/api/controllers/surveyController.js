const logger = require("../utils/logger");
const { connectToMongo } = require("../db");

async function submitSurvey(req, res) {
  logger.info('Submit survey endpoint hit', { 
    method: req.method,
    path: req.path,
    body: req.body 
  });

  let client;
  try {
    // Validate request
    if (!req.body || !req.body.email) {
      logger.warn('Invalid request body');
      return res.status(400).json({ message: 'Invalid request body' });
    }

    client = await connectToMongo();
    logger.info('MongoDB connected');
    
    const database = client.db("survey_db");
    const surveys = database.collection("surveys");

    const result = await surveys.insertOne(req.body);
    logger.info('Survey inserted', { id: result.insertedId });

    res.status(200).json({
      message: "Survey submitted successfully",
      id: result.insertedId,
    });
  } catch (error) {
    logger.error('Survey submission failed', { 
      error: error.message,
      stack: error.stack 
    });
    res.status(500).json({ message: "Error submitting survey" });
  } 
}

async function checkEmail(req, res) {
  let client;
  try {
    client = await connectToMongo();
    const { email } = req.body;
    const database = client.db("survey_db");
    const surveys = database.collection("surveys");

    const existingSurvey = await surveys.findOne({ email });
    res.status(200).json({ exists: !!existingSurvey });
  } catch (error) {
    console.error("Error checking email in MongoDB:", error);
    res.status(500).json({ message: "Error checking email" });
  }
}

module.exports = { submitSurvey, checkEmail };
