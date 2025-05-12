const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');

// Route to submit an assignment
router.post('/submit-assignment', assignmentController.submitAssignment);

module.exports = router;
