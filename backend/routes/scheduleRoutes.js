const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController'); // Ensure the path is correct

// Route for submitting schedule data
router.post('/update', scheduleController.updateScheduleData); // Match the function name in the controller

module.exports = router;
