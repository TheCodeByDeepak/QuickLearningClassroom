const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClassroomSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  startTiming: {
    type: String, // Storing time as a string like "09:00"
    required: true,
  },
  endTiming: {
    type: String, // Storing time as a string like "10:00"
    required: true,
  },
  faculties: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  students: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  code: {
    type: String,
    required: true,
    unique: true,
  },
  joinRequests: [{
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  }],
});

// Create and export the Classroom model
const Classroom = mongoose.model('Classroom', ClassroomSchema);
module.exports = Classroom;
