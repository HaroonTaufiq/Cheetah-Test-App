const { z } = require('zod');
const logger = require('../utils/logger');

const step1Schema = z.enum(['orange', 'black']);

const step2Schema = z.object({
  comfort: z.number().int().min(1).max(5),
  looks: z.number().int().min(1).max(5),
  price: z.number().int().min(1).max(5),
});

const surveySchema = z.object({
  email: z.string().email(),
  step: z.number().int().min(1).max(3),
  data: z.object({
    step1: step1Schema,
    step2: step2Schema,
  }),
  status: z.enum(['in-progress', 'completed']),
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