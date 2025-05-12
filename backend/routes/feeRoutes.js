const express = require('express');
const router = express.Router();
const feeController = require('../controllers/feeController');

router.post('/submit-fee', feeController.submitFeeData);

module.exports = router; // feeRoutes.js
