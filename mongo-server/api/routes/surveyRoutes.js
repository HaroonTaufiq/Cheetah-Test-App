// routes/surveyRoutes.js
const express = require('express');
const { submitSurvey, checkEmail } = require('../controllers/surveyController');
const validateSurvey = require('../middlewares/validateSurvey');

const router = express.Router();

router.post('/submit-survey', validateSurvey, submitSurvey);
router.post('/check-email', checkEmail);

module.exports = router;