const logger = require("../utils/logger");
const { connectToMongo } = require("../db");

function transformSurveyData(mongoDoc) {
  return {
    email: mongoDoc.email,
    first_question: mongoDoc.data.step2,
    second_question: {
      comfort: Number(mongoDoc.data.step3.comfort.$numberInt || mongoDoc.data.step3.comfort),
      looks: Number(mongoDoc.data.step3.looks.$numberInt || mongoDoc.data.step3.looks),
      price: Number(mongoDoc.data.step3.price.$numberInt || mongoDoc.data.step3.price)
    }
  };
}

async function submitSurvey(req, res) {
  logger.info('Submit survey endpoint hit', { 
    method: req.method,
    path: req.path,
    body: req.body 
  });

  let client;
  try {
    // Validate request
    if (!req.body || !req.body.email || !req.body.data || !req.body.data.step2 || !req.body.data.step3) {
      logger.warn('Invalid request body');
      return res.status(400).json({ message: 'Invalid request body' });
    }

    client = await connectToMongo();
    logger.info('MongoDB connected');
    
    const database = client.db("survey_db");
    const surveys = database.collection("surveys");

    // Transform the data before storing
    const transformedData = transformSurveyData(req.body);
    
    const result = await surveys.insertOne(transformedData);
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
  //  finally {
  //   if (client) {
  //     await client.close();
  //     logger.info('MongoDB connection closed');
  //   }
  // }
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
    logger.error("Error checking email in MongoDB:", error);
    res.status(500).json({ message: "Error checking email" });
  } 
  // finally {
  //   if (client) {
  //     await client.close();
  //     logger.info('MongoDB connection closed');
  //   }
  // }
}

async function getSurvey(req, res) {
  const email = req.query.email;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  let client;
  try {
    client = await connectToMongo();
    const database = client.db("survey_db");
    const surveys = database.collection("surveys");

    const survey = await surveys.findOne({ email });

    if (!survey) {
      return res.status(404).json({ error: 'Survey not found' });
    }

    // Transform data to match required format
    const transformedData = {
      email: survey.email,
      step: 3,
      data: {
        step1: survey.first_question,
        step2: survey.second_question
      },
      status: 'completed'
    };
    
    console.log(transformedData)
    res.status(200).json(transformedData);
  } catch (error) {
    logger.error("Error fetching survey:", error);
    res.status(500).json({ error: 'Internal server error' });
  } 
  // finally {
  //   if (client) {
  //     await client.close();
  //     logger.info('MongoDB connection closed');
  //   }
  // }
}

module.exports = { submitSurvey, checkEmail, getSurvey };