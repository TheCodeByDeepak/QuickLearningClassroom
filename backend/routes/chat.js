const express = require('express');
const ChatMessage = require('../models/ChatMessage');
const router = express.Router();

// Endpoint to get messages by classroom ID
router.get('/messages/:classroomId', async (req, res) => {
  try {

    const messages = await ChatMessage.find({ classroomId: req.params.classroomId })
      .populate('studentId', 'username')
      .sort({ timestamp: 1 });
    
    //console.log('Fetched messages:', messages); // Log the messages
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Error fetching messages' });
  }
});


// Endpoint to post a new message
router.post('/messages', async (req, res) => {
  console.log('POST /messages route hit');
  const { classroomId, studentId, message } = req.body;
  
  try {
    const chatMessage = new ChatMessage({
      classroomId,
      studentId,
      message
    });

    // Save the message
    await chatMessage.save();

    // Populate username and send the message back to the client
    const populatedMessage = await ChatMessage.findById(chatMessage._id).populate('studentId', 'username');
  
    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error('Error posting message:', error);
    res.status(500).json({ message: 'Error posting message' });
  }
});


module.exports = router;
