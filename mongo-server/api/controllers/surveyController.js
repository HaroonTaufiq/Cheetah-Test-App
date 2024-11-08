// controllers/surveyController.js
const { connectToMongo } = require("../db");
const logger = require("../utils/logger");

async function submitSurvey(req, res) {
  let client;
  try {
    client = await connectToMongo();
    const body = req.body;

    // Transform the data to the desired format
    const transformedData = {
      email: body.email,
      first_question: JSON.stringify(body.data.step2),
      second_question: JSON.stringify({
        looks: body.data.step3.looks,
        price: body.data.step3.price,
        comfort: body.data.step3.comfort,
      }),
      submittedAt: new Date(),
    };

    const database = client.db("survey_db");
    const surveys = database.collection("surveys");

    const result = await surveys.insertOne(transformedData);
    logger.info(`Survey submitted successfully for email: ${body.email}`);
    res.status(200).json({
      message: "Survey submitted successfully",
      id: result.insertedId,
    });
  } catch (error) {
    logger.error(`Error submitting survey to MongoDB: ${error.message}`);
    res.status(500).json({ message: "Error submitting survey" });
  } finally {
    if (client) {
      await client.close();
    }
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
    logger.info(`Email check performed for: ${email}`);
    res.status(200).json({ exists: !!existingSurvey });
  } catch (error) {
    logger.error(`Error checking email in MongoDB: ${error.message}`);
    res.status(500).json({ message: "Error checking email" });
  } finally {
    if (client) {
      await client.close();
    }
  }
}

module.exports = { submitSurvey, checkEmail };