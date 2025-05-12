const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import your User model
const { verifyToken } = require('../middleware/auth'); // Make sure to import your middleware

// PUT request to update user role


module.exports = router;
