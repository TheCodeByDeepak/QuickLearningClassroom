// In src/controllers/userController.js

const User = require('../models/User');

// Update user role
exports.updateUserRole = async (req, res) => {
  const { userId, role } = req.body;

  if (!['student', 'faculty', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.status(200).json({ message: 'User role updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
