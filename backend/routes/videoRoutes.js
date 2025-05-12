const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController'); // Ensure the path is correct

// Route for submitting video data
router.post('/upload-video', videoController.submitVideoData); // Match the function name in the controller

module.exports = router;
