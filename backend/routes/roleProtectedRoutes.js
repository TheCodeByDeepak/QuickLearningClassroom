const express = require('express');
const { verifyToken, verifyRole } = require('../middleware/auth');
const router = express.Router();

// Admin only route
router.get('/admin-dashboard', verifyToken, verifyRole('admin'), (req, res) => {
  res.status(200).json({ message: 'Welcome, Admin!' });
});

// Faculty only route
router.get('/faculty-dashboard', verifyToken, verifyRole('faculty', 'admin'), (req, res) => {
  res.status(200).json({ message: 'Welcome, Faculty or Admin!' });
});

// Student only route
router.get('/student-dashboard', verifyToken, verifyRole('student'), (req, res) => {
  res.status(200).json({ message: 'Welcome, Student!' });
});

module.exports = router;
