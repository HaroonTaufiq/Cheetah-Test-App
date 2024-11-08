// middlewares/validateSurvey.js
const Joi = require('joi');

const surveySchema = Joi.object({
  email: Joi.string().email().required(),
  data: Joi.object({
    step2: Joi.object().required(),
    step3: Joi.object({
      looks: Joi.number().min(1).max(5).required(),
      price: Joi.number().min(1).max(5).required(),
      comfort: Joi.number().min(1).max(5).required(),
    }).required(),
  }).required(),
});

module.exports = (req, res, next) => {
  const { error } = surveySchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};