const express = require('express');
const emailController = require('../controllers/emailSubmissionController');
const router = express.Router();

router.post('/submit-emails', emailController.submitEmailData);

module.exports = router;
