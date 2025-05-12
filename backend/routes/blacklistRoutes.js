const express = require('express');
const router = express.Router();
const blacklistController = require('../controllers/blacklistController');

// Route to submit blacklist data
router.post('/submit-blacklist', blacklistController.submitBlacklistData);

module.exports = router;
