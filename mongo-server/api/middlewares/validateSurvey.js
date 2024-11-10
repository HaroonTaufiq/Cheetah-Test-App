const { z } = require('zod');
const logger = require('../utils/logger');

const step2Schema = z.enum(['orange', 'black']);

const step3Schema = z.object({
  comfort: z.number().int().min(1).max(5),
  looks: z.number().int().min(1).max(5),
  price: z.number().int().min(1).max(5),
});

const surveySchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  step: z.number().int().min(1).max(3),
  data: z.object({
    step2: step2Schema,
    step3: step3Schema,
  }),
  status: z.enum(['in-progress', 'completed']),
  created_at: z.string(),
  updated_at: z.string(),
});

module.exports = (req, res, next) => {
  try {
    surveySchema.parse(req.body);
    next();
  } catch (error) {
    logger.error('Survey validation failed', { error: error.errors });
    res.status(400).json({ message: 'Invalid survey data', errors: error.errors });
  }
};