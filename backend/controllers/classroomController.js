const mongoose = require('mongoose');
const Classroom = require('../models/Classroom');
const User = require('../models/User');

// Controller to handle join requests
exports.joinClassroom = async (req, res) => {
  try {
    const { code } = req.body; // Join code from request body
    const studentId = req.user.id; // User ID from token

    // Find classroom with the provided join code
    const classroom = await Classroom.findOne({ code });

    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }

    // Check if the join request already exists
    const existingRequest = classroom.joinRequests.find(req => req.studentId.toString() === studentId);

    if (existingRequest) {
      return res.status(400).json({ message: 'Join request already sent' });
    }

    // Create a new join request
    classroom.joinRequests.push({ studentId, status: 'pending' });
    await classroom.save();

    res.status(201).json({ message: 'Join request sent successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send join request' });
  }
};

// Handle approve or reject by admin
exports.manageJoinRequests = async (req, res) => {
  try {
    const { classroomId, studentId, action } = req.body; // Action can be 'approve' or 'reject'

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(classroomId) || !mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: 'Invalid classroomId or studentId' });
    }

    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }

    // Find the join request for the specific student
    const requestIndex = classroom.joinRequests.findIndex(req => req.studentId.toString() === studentId);

    if (requestIndex === -1) {
      return res.status(404).json({ message: 'Join request not found' });
    }

    if (action === 'approve') {
      // Add student to classroom only if not already present
      if (!classroom.students.includes(studentId)) {
        classroom.students.push(studentId); // Add student to classroom
      }
      classroom.joinRequests[requestIndex].status = 'approved'; // Update request status to approved
    } else if (action === 'reject') {
      // Update join request status to 'rejected'
      classroom.joinRequests[requestIndex].status = 'rejected';

      // Remove student from the classroom if they exist in the students array
      classroom.students = classroom.students.filter(id => id.toString() !== studentId);
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }

    // Save the updated classroom
    await classroom.save();

    res.status(200).json({ message: `Join request ${action}d successfully.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to manage join requests' });
  }
};


// Fetch all join requests for a specific classroom
exports.getJoinRequests = async (req, res) => {
  try {
    const { classroomId } = req.params; // Get classroom ID from URL parameters

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(classroomId)) {
      return res.status(400).json({ message: 'Invalid classroomId' });
    }

    const classroom = await Classroom.findById(classroomId).populate('joinRequests.studentId', 'username email');
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }

    // Fetch all join requests for the specified classroom
    res.status(200).json(classroom.joinRequests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to retrieve join requests' });
  }
};

// Handle join requests for a specific classroom (this is the added function)
exports.handleJoinRequest = async (req, res) => {
  try {
    const { classroomId } = req.params; // Get classroom ID from URL parameters

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(classroomId)) {
      return res.status(400).json({ message: 'Invalid classroomId' });
    }

    const classroom = await Classroom.findById(classroomId).populate('joinRequests.studentId', 'username email');
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }

    // Send join requests related to the classroom
    res.status(200).json(classroom.joinRequests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to retrieve join requests' });
  }
};
