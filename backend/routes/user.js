// routes/user.js
const express = require('express');
const User = require('../models/User');
const Classroom = require('../models/Classroom');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

// Get all faculties
router.get('/faculties', verifyToken, async (req, res) => {
  try {
    const faculties = await User.find({ role: 'faculty' });
    res.status(200).json(faculties);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve faculty list' });
  }
});

// Route to fetch all users
router.get('/all', verifyToken, async (req, res) => {
  try {
      const users = await User.find();
      res.json(users);
  } catch (error) {
      res.status(500).json({ message: "Failed to retrieve users" });
  }
});

// Example route in Node.js/Express
router.get('/profile/:id', async (req, res) => {
  const userId = req.params.id; // Extract the `_id` from the request parameter
  try {
    const user = await User.findById(userId); // Use `findById` for MongoDB `_id`
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user' });
  }
});





router.get('/allclassroom', verifyToken, async (req, res) => {
  try {
    const classrooms = await Classroom.find(); // Fetch all classrooms from the database
    res.status(200).json(classrooms); // Send the classrooms as the response
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve classrooms.' });
  }
});
module.exports = router;
