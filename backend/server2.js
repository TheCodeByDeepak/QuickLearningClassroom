const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const ChatMessage = require('./models/ChatMessage'); // Import the ChatMessage model
const chatRoutes = require('./routes/chat'); // Import chat routes

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI; // Replace with your MongoDB URI
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

// Middleware
app.use(cors({ origin: 'http://localhost:3000' })); // Enable CORS for frontend
app.use(express.json()); // For parsing JSON request bodies

// Routes
app.use('/api/chat', chatRoutes); // Add chat routes with a base path

// Example route to test backend
app.get('/', (req, res) => {
  res.send('Backend is running...');
});

// Socket.IO
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle room joining
  socket.on('joinRoom', ({ classroomId, studentId }) => {
    socket.join(classroomId); // Join the room by classroomId
    console.log(`User joined room: ${classroomId}`);
  });

  // Handle chat message event
// Handle chat message event
socket.on('chatMessage', async (msg) => {
  const { classroomId, studentId, message } = msg;
  //console.log('Message received:', msg);

  try {
    // Save the message to MongoDB
    const newMessage = new ChatMessage({
      classroomId: new mongoose.Types.ObjectId(classroomId),
      studentId: new mongoose.Types.ObjectId(studentId),
      message: message,
    });

    // Save message in MongoDB
    const savedMessage = await newMessage.save();
    //console.log('Message saved to MongoDB:', savedMessage);

    // Populate the studentId field with the username from the User model
    const populatedMessage = await ChatMessage.findById(savedMessage._id).populate('studentId', 'username');

    // Emit the populated message to the specific room (classroomId)
    io.to(classroomId).emit('chatMessage', populatedMessage);

  } catch (error) {
    console.error('Error saving message to MongoDB:', error);
  }
});



  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
