const express = require('express');
const router = express.Router();
const marksController = require('../controllers/marksController');

// Route for submitting marks
router.post('/submit-marks', marksController.submitMarks);

module.exports = router;
