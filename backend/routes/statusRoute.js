const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/statusController');

// Route to submit assignment status (Approve/Reject)
router.post('/submit-assignment-status', assignmentController.submitAssignment);

module.exports = router;
