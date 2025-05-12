const googleMeetController = require('../controllers/googleMeetController');
const express = require('express');
const router = express.Router();

router.post('/update-google-meet-link', googleMeetController.submitGoogleMeetData);

module.exports = router;
