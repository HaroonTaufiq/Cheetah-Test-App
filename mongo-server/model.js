const mongoose = require('mongoose');
const { z } = require('zod');

const formDataSchema = z.object({
  email: z.string().email(),
  first_question: z.string().optional(),
  second_question: z.array(z.number()).optional(),
});

const mongooseFormDataSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  first_question: String,
  second_question: [Number],
});

const FormData = mongoose.model('FormData', mongooseFormDataSchema);

async function saveFormData(data) {
  try {
    // Validate data using Zod
    formDataSchema.parse(data);

    // Save to MongoDB using Mongoose
    const formData = new FormData(data);
    await formData.save();
    console.log('Form data saved successfully');
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.errors);
    } else {
      console.error('Error saving form data:', error);
    }
  }
}

module.exports = { FormData, saveFormData };