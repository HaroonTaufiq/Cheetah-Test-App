
const express = require('express');
const { submitSurvey, checkEmail, getSurvey } = require('../controllers/surveyController');
const validateSurvey = require('../middlewares/validateSurvey');

const router = express.Router();

router.post('/submit-survey', validateSurvey, submitSurvey);
router.post('/check-email', checkEmail);
router.get('/get-survey', getSurvey)

module.exports = router;