const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

router.post('/submit-attendance', attendanceController.submitAttendance);
router.post('/submit-expense', attendanceController.submitExpense);

module.exports = router;









