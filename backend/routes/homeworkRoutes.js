const express = require('express');
const router = express.Router();
const homeworkController = require('../controllers/homeworkController');

router.post('/submit-homework', homeworkController.submitHomework);

module.exports = router;
