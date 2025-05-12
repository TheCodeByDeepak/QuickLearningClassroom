const express = require('express');
const formController = require('../controllers/formController'); // Adjust the path as needed

const router = express.Router();

router.post('/submit-form', formController.submitFormData);

module.exports = router;
