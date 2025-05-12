const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ['student', 'faculty', 'admin'], // Restrict roles
    default: 'student', // Set default role as student
  },
});

module.exports = mongoose.model('User', UserSchema);
