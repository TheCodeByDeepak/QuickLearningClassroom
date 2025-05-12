import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HomeworkViewer from './HomeworkViewer'; // Assuming HomeworkViewer is in the same directory
import './CSS/Status.css'

const Status = ({ classroom, students, closeForm }) => {
  const [homeworkData, setHomeworkData] = useState({});
  const [startDate, setStartDate] = useState(''); // State for start date
  const [endDate, setEndDate] = useState(''); // State for end date
  const [viewHomeworkForStudent, setViewHomeworkForStudent] = useState(null); // Track selected student's homework visibility

  useEffect(() => {
    // Initialize student data
    const initialData = {};
    students.forEach((student) => {
      initialData[student._id] = {
        selected: true, // Initially, all students are selected
        status: '', // Default status (Approved/Rejected)
        remark: '', // Remark for each student
      };
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

  const handleStatusChange = async (studentId, status) => {
    setHomeworkData((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status, // Set the status (Approved/Rejected)
      },
    }));

    // Prepare data for submission
    const data = {
      classroomId: classroom._id,
      studentId: studentId,
      startDate: startDate,
      endDate: endDate,
      remark: homeworkData[studentId]?.remark, // Use specific remark
      status: status, // Approved or Rejected
    };

    // Submit the data
    try {
      await axios.post('http://localhost:5000/api/status/submit-assignment-status', data);
      alert(`Assignment for ${status} successfully.`);
    } catch (err) {
      console.error('Failed to update homework status:', err);
      alert('Failed to update homework status');
    }
  };

  const handleRemarkChange = (studentId, remark) => {
    setHomeworkData((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remark, // Set the remark for the student
      },
    }));
  };

  const handleViewHomework = (studentId) => {
    // Toggle visibility for homework
    setViewHomeworkForStudent((prev) => (prev === studentId ? null : studentId));
  };

  return (
    <div><div className='status-container'>
      <h3 className="status-title">Assign Assignment for {classroom.name}</h3>

      {/* Start and End Date fields */}
      <div style={{ marginTop: '20px' }}>
        <label className="satus-label">Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="status-input"
        />
        <label className="satus-label">End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="status-input"
        />
      </div>

      <h3 style={{ marginTop: '20px' }}>Select Students:</h3>
      {students.map((student) => (
        <div key={student._id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <input
            type="checkbox"
            checked={homeworkData[student._id]?.selected || false}
            onChange={() => handleCheckboxChange(student._id)}
           className="status-checkbox"
          />
          <p style={{ marginRight: '10px', minWidth: '100px' }}>{student.username}</p>

          <div style={{ marginRight: '10px' }}>
            <button onClick={() => handleStatusChange(student._id, 'Approved')} className='status-approve'>
              Approve
            </button>
            <button onClick={() => handleStatusChange(student._id, 'Rejected')} className='status-reject'>
              Reject
            </button>
          </div>

          <div style={{ marginLeft: '10px' }}>
            <input
              type="text"
              value={homeworkData[student._id]?.remark || ''}
              onChange={(e) => handleRemarkChange(student._id, e.target.value)}
              placeholder="Enter remark"
              className='status-input'
            />
          </div>

          {/* Button to toggle view homework */}
          <button
            onClick={() => handleViewHomework(student._id)}
           className='status-view'
          >
            {viewHomeworkForStudent === student._id ? 'Hide Homework' : 'View Homework'}
          </button>
        </div> 
      ))}</div>

      {/* Conditionally render HomeworkViewer if a student is selected */}
      {viewHomeworkForStudent && (
        <HomeworkViewer
          classroomId={classroom._id}
          studentId={viewHomeworkForStudent}
        />
      )}
    </div>
  );
};

export default Status;
