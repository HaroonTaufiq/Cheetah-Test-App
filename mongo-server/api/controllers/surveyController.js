
const { connectToMongo } = require('../db');

async function submitSurvey(req, res) {
  let client;
  try {
    client = await connectToMongo();
    const body = req.body;
    
    // Transform the data to the desired format
    const transformedData = {
      email: body.email,
      first_question: body.data.step1,
      second_question: JSON.stringify(body.data.step2),
      submittedAt: new Date()
    };

    const database = client.db('survey_db');
    const surveys = database.collection('surveys');

    const result = await surveys.insertOne(transformedData);
    res.status(200).json({ message: 'Survey submitted successfully', id: result.insertedId });
  } catch (error) {
    console.error('Error submitting survey to MongoDB:', error);
    res.status(500).json({ message: 'Error submitting survey' });
  }
}

async function checkEmail(req, res) {
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
  }
}

module.exports = { submitSurvey, checkEmail };