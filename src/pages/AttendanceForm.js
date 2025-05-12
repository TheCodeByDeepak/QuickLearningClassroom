import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CSS/AttendanceForm.css'

const AttendanceForm = ({ classroom, students, closeForm }) => {

  const [attendanceData, setAttendanceData] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Default to today's date

  // Initialize attendance status to "Present" by default
  useEffect(() => {
    const initialData = {};
    students.forEach((student) => {
      initialData[student._id] = { status: 'Present', note: '' };
    });
    setAttendanceData(initialData);
  }, [students]);

  const handleAttendanceChange = (studentId, field, value) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value,
      },
    }));
  };

  const submitAttendance = async () => {
    const missingNotes = students.some(
      (student) =>
        (attendanceData[student._id]?.status === 'Absent' || attendanceData[student._id]?.status === 'Late') &&
        !attendanceData[student._id]?.note
    );

    if (missingNotes) {
      alert('Please fill out the note for all students marked as Absent or Late.');
      return;
    }

    const formattedData = students.map((student) => ({
      classroomName: classroom.name,
      classroomId: classroom._id,
      studentName: student.username,
      studentId: student._id,
      date: selectedDate,
      status: attendanceData[student._id]?.status || 'Absent',
      note: attendanceData[student._id]?.note || '',
    }));

    try {
      await axios.post('http://localhost:5000/api/submit-attendance', formattedData);
      alert('Attendance submitted successfully');
      closeForm();
    } catch (err) {
      console.error('Failed to submit attendance:', err);
      alert('Failed to submit attendance');
    }
  };

  return (
    <div className="attendance-container">
  <h3 className="attendance-title">Mark Attendance for {classroom.name}</h3>
  <p className="attendance-note">
    <strong>Note: </strong>Use the same <mark>Date</mark> to re-update the Existing Attendance.
  </p>
  
  <label className="attendance-date">
    Date:
    <input
  type="date"
  className="attendance-date-input"
  value={selectedDate}
  onChange={(e) => setSelectedDate(e.target.value)}
/>

  </label>

  {students.map((student) => (
    <div key={student._id} className="attendance-row">
      <p className="attendance-student">{student.username}</p>

      <select
        className="attendance-select"
        onChange={(e) => handleAttendanceChange(student._id, 'status', e.target.value)}
        value={attendanceData[student._id]?.status || 'Present'}
      >
        <option value="Present">Present</option>
        <option value="Absent">Absent</option>
        <option value="Late">Late</option>
        <option value="Holiday">Holiday</option>
      </select>

      {(attendanceData[student._id]?.status === 'Absent' || 
        attendanceData[student._id]?.status === 'Late' || 
        attendanceData[student._id]?.status === 'Holiday') && (
        <input
          type="text"
          className="attendance-note-input"
          placeholder="Note (required)"
          value={attendanceData[student._id]?.note || ''}
          onChange={(e) => handleAttendanceChange(student._id, 'note', e.target.value)}
          required
        />
      )}
    </div>
  ))}

  <button onClick={submitAttendance} className="attendance-submit">
    Submit Attendance
  </button> 
</div>
  );
};

export default AttendanceForm;