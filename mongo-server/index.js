const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect("mongodb+srv://haroon:<db_password>@cluster0.jwvai.mongodb.net/")
  .then(() => {
    console.log("connection is successful");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.json()); 

const Schema = mongoose.Schema;

const FormDataSchema = new Schema({
    email: { type: String, required: true, unique: true },
    first_question: String,
    second_question: String
});

const FormData = mongoose.model('FormData', FormDataSchema);

app.post('/submit-form', async (req, res) => {
    try {
        const formData = new FormData(req.body);
        await formData.save();
        res.status(201).send(formData);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
