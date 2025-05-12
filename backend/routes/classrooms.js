const express = require('express');
const Classroom = require('../models/Classroom');
const { verifyToken, verifyRole } = require('../middleware/auth'); // Ensure both are imported from the same path
const router = express.Router();
const classroomController = require('../controllers/classroomController');
const User = require('../models/User');
const userController = require('../controllers/userController');

const { joinClassroom, manageJoinRequests, getJoinRequests } = require('../controllers/classroomController');
const { updateUserRole } = require('../controllers/userController');

//to send join request
router.post('/join-request',verifyToken, classroomController.joinClassroom);

// Admin manages join requests
router.post('/manage-requests', verifyToken, verifyRole('admin'), manageJoinRequests);



// Fetch join requests for a specific classroom
router.get('/:classroomId/join-request', classroomController.getJoinRequests);



// Create a classroom
router.post('/create', verifyToken, async (req, res) => {
  const { name, subject,startTiming,endTiming, code, facultyIds } = req.body;

  try {
    const existingClassroom = await Classroom.findOne({ code });
    if (existingClassroom) {
      return res.status(400).json({ message: 'Classroom code must be unique' });
    }

    const newClassroom = new Classroom({
      name,
      subject,
      startTiming,
      endTiming,
      code,
      faculties: facultyIds,
    });

    await newClassroom.save();

    const populatedClassroom = await Classroom.findById(newClassroom._id).populate('faculties', 'username email');
    res.status(201).json({ message: 'Classroom created successfully', classroom: populatedClassroom });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create classroom' });
  }
});

// Fetch all classrooms with populated faculties
router.get('/', verifyToken, async (req, res) => {
  try {
    const classrooms = await Classroom.find().populate('faculties', 'username email');
    res.status(200).json(classrooms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch classrooms' });
  }
});

// Fetch a single classroom with populated faculties and students
router.get('/:classroomId', verifyToken, async (req, res) => {
  try {
    const classroom = await Classroom.findById(req.params.classroomId).populate('faculties students', 'username email');
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }

    res.status(200).json(classroom);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to retrieve classroom details' });
  }
});

// Add students to a classroom
router.post('/:classroomId/students', verifyToken, async (req, res) => {
  //console.log('Request body:', req.body);
  let { studentIds } = req.body;
  const { classroomId } = req.params;

  //console.log('Received studentIds:', studentIds);

  if (!Array.isArray(studentIds)) {
    studentIds = [studentIds];
  }

  if (!studentIds || studentIds.length === 0) {
    return res.status(400).json({ message: 'studentIds must be a non-empty array' });
  }

  try {
    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }

    const existingStudents = new Set(classroom.students.map(student => student.toString()));
    const newStudents = studentIds.filter(studentId => !existingStudents.has(studentId));

    if (newStudents.length === 0) {
      return res.status(400).json({ message: 'All students are already in the classroom' });
    }

    classroom.students.push(...newStudents);
    await classroom.save();

    res.status(200).json({ message: 'Students added successfully', students: classroom.students });
  } catch (err) {
    console.error('Error adding students:', err);
    res.status(500).json({ message: 'Failed to add students to classroom' });
  }
});

// Fetch all students in a classroom
router.get('/:classroomId/students', verifyToken, async (req, res) => {
  const { classroomId } = req.params;

  try {
    const classroom = await Classroom.findById(classroomId).populate('students', 'username email');
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }

    res.status(200).json(classroom.students);
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ message: 'Failed to retrieve students' });
  }
});



// Fetch all faculties in a classroom
router.get('/:classroomId/faculties', verifyToken, async (req, res) => {
  const { classroomId } = req.params;
  // Log the classroom ID to check if it's being received correctly
  

  try {
    const classroom = await Classroom.findById(classroomId).populate('faculties', 'username email');
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }

    res.status(200).json(classroom.faculties);
  } catch (err) {
    console.error('Error fetching faculties:', err);
    res.status(500).json({ message: 'Failed to retrieve faculties' });
  }
});



// Add faculties to a classroom
router.post('/:classroomId/faculties', verifyToken, async (req, res) => {
  const { facultyIds } = req.body;
  const { classroomId } = req.params;

  if (!Array.isArray(facultyIds)) {
    return res.status(400).json({ message: 'facultyIds must be a non-empty array' });
  }

  try {
    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }

    const existingFaculties = new Set(classroom.faculties.map(faculty => faculty.toString()));
    const newFaculties = facultyIds.filter(facultyId => !existingFaculties.has(facultyId));

    if (newFaculties.length === 0) {
      return res.status(400).json({ message: 'All faculties are already in the classroom' });
    }

    classroom.faculties.push(...newFaculties);
    await classroom.save();

    res.status(200).json({ message: 'Faculties added successfully', faculties: classroom.faculties });
  } catch (err) {
    console.error('Error adding faculties:', err);
    res.status(500).json({ message: 'Failed to add faculties to classroom' });
  }
});



// Remove a faculty from a classroom
router.delete('/:classroomId/faculties/:facultyId', verifyToken, async (req, res) => {
  const { classroomId, facultyId } = req.params;

  try {
    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }

    // Check if facultyId exists in the faculties array
    const index = classroom.faculties.indexOf(facultyId);
    if (index === -1) {
      return res.status(404).json({ message: 'Faculty not found in this classroom' });
    }

    // Remove the facultyId from the faculties array
    classroom.faculties.splice(index, 1);
    await classroom.save();

    res.status(200).json({ message: 'Faculty removed successfully' });
  } catch (err) {
    console.error('Error removing faculty:', err);
    res.status(500).json({ message: 'Failed to remove faculty' });
  }
});


//handle to to remove student
router.delete('/:classroomId/students/:studentId', verifyToken, async (req, res) => {
  const { classroomId, studentId } = req.params;

  try {
    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }

    // Check if studentId exists in the students array
    const index = classroom.students.indexOf(studentId);
    if (index === -1) {
      return res.status(404).json({ message: 'Student not found in this classroom' });
    }

    // Remove the studentId from the students array
    classroom.students.splice(index, 1);
    await classroom.save();

    res.status(200).json({ message: 'Student removed successfully' });
  } catch (err) {
    console.error('Error removing student:', err);
    res.status(500).json({ message: 'Failed to remove student' });
  }
});


// Update user details endpoint
router.put('/updateRole', verifyToken, async (req, res) => {
  const { userId, role, username, email, password } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Validate and update role
    if (role && !['student', 'faculty', 'admin'].includes(role)) {
      return res.status(400).send('Invalid role');
    }
    if (role) user.role = role;

    // Update username and email if provided
    if (username) user.username = username;
    if (email) user.email = email;

    // Update password securely if provided
    if (password) {
      // Hash the password before saving
      const bcrypt = require('bcrypt');
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // Save the updated user
    await user.save();

    res.status(200).send('User details updated successfully');
  } catch (error) {
    console.error('Error updating user details:', error);
    res.status(500).send('Error updating user details');
  }
});

//delete user
router.delete('/deleteUser/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.status(200).send('User deleted successfully');
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send('Error deleting user');
  }
});

//update classroom
router.put('/update/:id', verifyToken, async (req, res) => {
  const { name, subject, startTiming, endTiming, code } = req.body;

  try {
    const updatedClassroom = await Classroom.findByIdAndUpdate(
      req.params.id,
      { name, subject, startTiming, endTiming, code},
      { new: true } // To return the updated classroom
    );

    if (!updatedClassroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }

    res.status(200).json(updatedClassroom);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating classroom details' });
  }
});


// Route to delete a classroom
router.delete('/deleteClassroom/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const classroom = await Classroom.findByIdAndDelete(id);

    if (!classroom) {
      return res.status(404).send('Classroom not found');
    }

    res.status(200).send('Classroom deleted successfully');
  } catch (error) {
    console.error('Error deleting classroom:', error);
    res.status(500).send('Error deleting classroom');
  }
});


// Fetch classrooms along with faculty and student names
router.get('/faculties/classrooms',verifyToken, async (req, res) => {
  try {
    const facultyId = req.user.id; // Ensure req.user.id has the authenticated student's ID

    // Find classrooms where the student is a member
    const classrooms = await Classroom.find({ faculties: facultyId });

    res.json(classrooms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching classrooms' });
  }
});


// Route to get classrooms for the authenticated student
router.get('/students/classrooms',verifyToken, async (req, res) => {
  try {
    const studentId = req.user.id; // Ensure req.user.id has the authenticated student's ID

    // Find classrooms where the student is a member
    const classrooms = await Classroom.find({ students: studentId });

    res.json(classrooms); // Return the classrooms as JSON
  } catch (error) {
    res.status(500).json({ message: 'Error fetching classrooms for student' });
  }
});




// Export the router
module.exports = router;
