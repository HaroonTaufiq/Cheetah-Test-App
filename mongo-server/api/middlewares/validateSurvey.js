// middlewares/validateSurvey.js
const { z } = require('zod');

const step2Schema = z.object({
  comfort: z.number().int().min(1).max(5),
  looks: z.number().int().min(1).max(5),
  price: z.number().int().min(1).max(5),
});

const surveySchema = z.object({
  email: z.string().email(),
  step: z.number().int().min(1).max(3),
  data: z.object({
    step1: z.enum(['orange', 'black']).optional(),
    step2: z.union([step2Schema, z.string()]).transform((val) => {
      if (typeof val === 'string') {
        try {
          return JSON.parse(val)
        } catch {
          throw new Error('Invalid JSON string for step2')
        }
      }
      return val
    }),
  }),
  status: z.enum(['in-progress', 'completed']),
});

module.exports = (req, res, next) => {
  try {
    surveySchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({ error: error.errors });
  }
};