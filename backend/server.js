const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user'); 
const classroomRoutes = require('./routes/classrooms');
const facultyRoutes = require('./routes/classrooms');
const studentRoutes = require('./routes/classrooms')
const attendanceRoutes = require('./routes/attendanceRoutes');
const bodyParser = require('body-parser');
const attendanceRoute = require("./routes/attendance");
const marks = require('./routes/marks')
const video = require('./routes/video')
const schedule = require('./routes/schedule')
const feeRoutes = require('./routes/feeRoutes');
const blacklistRoutes =require('./routes/blacklistRoutes') 
const feeRouter = require("./routes/feeRouter");
const blacklistRouter = require("./routes/blacklistRouter")
const marksRoutes = require('./routes/marksRoutes');
const homeworkRoutes = require('./routes/homeworkRoutes');
const videoRoutes = require('./routes/videoRoutes');
const studyMaterial = require('./routes/studyMaterial')
const homeworkRoute = require("./routes/homeworkRoute");
const studyMaterialRouter = require('./routes/studyMaterialRouter')
const scheduleRoutes = require('./routes/scheduleRoutes');
const hwuploadRouter = require('./routes/hwuploadRouter')
const expenseRoutes = require('./routes/expenseRoutes');
const statusRoute = require('./routes/statusRoute');
const homeworkViewRoute = require('./routes/HomeworkViewRoute')
const assignmentRoutes = require('./routes/assignmentRoutes');
const formRoutes = require('./routes/formRoutes');
const form = require("./routes/form");
const googlemeetRoutes = require('./routes/googlemeetRoutes')
const googlemeet = require('./routes/googlemeet')
const emailRoutes = require('./routes/emailRoutes')
const email = require('./routes/email')
const emailSendingRoute = require('./routes/emailSendingRoute')
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, 
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.log('Failed to connect to MongoDB Atlas', err));

// Register the routes
app.use('/api/auth', authRoutes);
app.use('/api', emailSendingRoute)
app.use('/api/emails', email)
app.use('/api/users', userRoutes); // Register the user routes
app.use('/api/classrooms', classroomRoutes); // Register the classrooms routes
app.use('/api', facultyRoutes);
app.use('/api', emailRoutes);
app.use('/api', studentRoutes);
app.use('/api', studyMaterial);
app.use('/api', studyMaterialRouter);
app.use('/api', attendanceRoutes);
app.use("/api/homework", homeworkRoute);
app.use("/api/attendance", attendanceRoute);
app.use('/api/testmarks',marks)
app.use('/api/videos', video)
app.use('/api/schedule', schedule)
app.use("/api/fees", feeRouter);
app.use('/api/expenses', expenseRoutes);
app.use('/api', feeRoutes);
app.use('/api', videoRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/blacklists', blacklistRouter)
app.use('/api/blacklist', blacklistRoutes)
app.use('/api', marksRoutes)
app.use('/api', hwuploadRouter)
app.use('/api/assignment',assignmentRoutes);
app.use('/api/homework', homeworkRoutes);
app.use('/api/status', statusRoute);
app.use('/api', formRoutes);
app.use("/api/forms", form); 
app.use('/api/forms', googlemeet)
app.use('/api', homeworkViewRoute)
app.use('/api', googlemeetRoutes)
app.use(bodyParser.json()); // Use bodyParser to parse JSON request bodies

app.get('/', (req, res) => {
  res.send('API is running');
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
