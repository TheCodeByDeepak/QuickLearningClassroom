import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CSS/HomeworkAssignmentForm.css'

const HomeworkAssignmentForm = ({ classroom, students, closeForm }) => {
  const [homeworkData, setHomeworkData] = useState({});
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    // Set default start and end date/time
    const now = new Date();

    // Current date and time
    const currentDate = now.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const currentTime = now.toTimeString().split(':').slice(0, 2).join(':'); // Format: HH:MM

    // Date and time 24 hours from now
    const nextDay = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Add 24 hours in milliseconds
    const nextDate = nextDay.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const nextTime = nextDay.toTimeString().split(':').slice(0, 2).join(':'); // Format: HH:MM

    setStartDate(currentDate);
    setStartTime(currentTime);
    setEndDate(nextDate);
    setEndTime(nextTime);

    // Initialize student selection
    const initialData = {};
    students.forEach((student) => {
      initialData[student._id] = { selected: true }; // Initially, all students are selected
    });
    setHomeworkData(initialData);
  }, [students]);

  const handleCheckboxChange = (studentId) => {
    setHomeworkData((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        selected: !prev[studentId].selected,
      },
    }));
  };

  const submitHomework = async () => {
    if (!startDate || !startTime || !endDate || !endTime || !description.trim()) {
      alert('All fields are required.');
      return;
    }

    const selectedStudents = students.filter((student) => homeworkData[student._id]?.selected);

    if (selectedStudents.length === 0) {
      alert('Please select at least one student.');
      return;
    }

    const formattedData = selectedStudents.map((student) => ({
      classroomName: classroom.name,
      classroomId: classroom._id,
      studentName: student.username,
      studentId: student._id,
      startDate,
      startTime,
      endDate,
      endTime,
      description,
    }));

    try {
      await axios.post('http://localhost:5000/api/assignment/submit-homework', formattedData);
      alert('Homework assigned successfully');
      closeForm();
    } catch (err) {
      console.error('Failed to assign homework:', err);
      alert('Failed to assign homework');
    }
  };

  return (
    <div className='container'>
      <h3 className='title'>Assign Homework for {classroom.name}</h3>
      <p><strong>Note: </strong>Use the same <mark>Start Date & End Date</mark> to re-update the Existing Homework </p>
      <label className='label'>
        Start Date:
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className='input'
        />
      </label>

      <label className='label'>
        Start Time:
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className='input'
        />
      </label>

      <label className='label'>
        End Date:
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
         className='input'
        />
      </label>

      <label className='label'>
        End Time:
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className='input'
        />
      </label>

      <label className='label'><br />
        Description:
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className='input'
        />
      </label>

      <h3 style={{ marginTop: '20px' }}>Select Students:</h3>
      {students.map((student) => (
        <div key={student._id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <input
            type="checkbox"
            checked={homeworkData[student._id]?.selected || false}
            onChange={() => handleCheckboxChange(student._id)}
            className='custom-checkbox'
          />
          <p style={{ marginLeft: '10px', minWidth: '100px' }}>{student.username}</p>
        </div>
      ))}

      <button
        onClick={submitHomework}
        className='submit'
      >
        Assign Homework
      </button>
    </div>
  );
};

export default HomeworkAssignmentForm;
