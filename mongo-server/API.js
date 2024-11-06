const express = require('express');
const FormData = require('./model');
const router = express.Router();

router.post('/submit-form', async (req, res) => {
    try {
        const formData = new FormData(req.body);
        await formData.save();
        res.status(201).send(formData);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
