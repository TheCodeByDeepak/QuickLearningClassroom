import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CSS/EmailSubmissionForm.css'

const EmailSubmissionForm = ({ classroom, students, closeForm }) => {
  const [emailData, setEmailData] = useState({});
  const [selectedStudents, setSelectedStudents] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Default to today's date

  // Initialize emailData and selectedStudents
  useEffect(() => {
    const initialEmailData = {};
    const initialSelectedStudents = {};
    students.forEach((student) => {
      initialEmailData[student._id] = { email: '' };
      initialSelectedStudents[student._id] = true; // All students selected by default
    });
    setEmailData(initialEmailData);
    setSelectedStudents(initialSelectedStudents);
  }, [students]);

  // Debugging: Log emailData changes
  const handleEmailChange = (studentId, value) => {
    setEmailData((prev) => {
      const updatedData = {
        ...prev,
        [studentId]: {
          ...prev[studentId],
          email: value,
        },
      };
      return updatedData;
    });
  };

  const handleCheckboxChange = (studentId) => {
    setSelectedStudents((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  const submitEmails = async () => {
    const missingEmails = students.some(
      (student) =>
        selectedStudents[student._id] &&
        !emailData[student._id]?.email
    );

    if (missingEmails) {
      alert('Please fill out the email for all selected students.');
      return;
    }

    const formattedData = students
      .filter((student) => selectedStudents[student._id]) // Only include selected students
      .map((student) => ({
        classroomName: classroom.name,
        classroomId: classroom._id,
        studentName: student.username,
        studentId: student._id,
        date: selectedDate,
        email: emailData[student._id]?.email,
      }));

    try {
      await axios.post('http://localhost:5000/api/submit-emails', { emailData: formattedData });
      alert('Emails submitted successfully');
      closeForm();
    } catch (err) {
      console.error('Failed to submit emails:', err.response ? err.response.data : err);
      alert('Failed to submit emails');
    }
  };

  return (
    <div className='emailform-container'>
      <h3 className="emailform-title">Submit Emails for {classroom.name}</h3>
      <p>
        <strong>Note: </strong>Enter new <mark>Email</mark> to re-update the Existing Email
      </p>
      <label className="emailform-label">
        Date:
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="emailformdate-input"
        />
      </label>

      {students.map((student) => (
        <div
          key={student._id}
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '10px',
          }}
        >
          <input
            type="checkbox"
            checked={selectedStudents[student._id]}
            onChange={() => handleCheckboxChange(student._id)}
            className="emailform-checkbox"
          />
          <p style={{ marginRight: '10px', minWidth: '100px' }}>{student.username}</p>
          <input
            type="email"
            placeholder="Enter email"
            value={emailData[student._id]?.email || ''}
            onChange={(e) => handleEmailChange(student._id, e.target.value)}
            disabled={!selectedStudents[student._id]} // Disable input if student is not selected
            required
            className="emailform-input"
          />
        </div>
      ))}
      <button
        onClick={submitEmails}
        className="emailform-submit"
      >
        Submit Emails
      </button>
    </div>
  );
};

export default EmailSubmissionForm;
