import React, { useState } from 'react';
import axios from 'axios';
import './CSS/ScheduleUpdateForm.css'

const ScheduleUpdateForm = ({ classroom, closeForm }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [subject, setSubject] = useState('');
  const [additionalNote, setAdditionalNote] = useState('');

  const submitScheduleDetails = async () => {
    if (!subject.trim()) {
      alert('Subject is required.');
      return;
    }
    if (!selectedDate) {
      alert('Date is required.');
      return;
    }

    const scheduleData = {
      classroomName: classroom.name,
      classroomId: classroom._id,
      date: selectedDate,
      subject,
      additionalNote,
    };

    try {
      await axios.post('http://localhost:5000/api/schedule/update', scheduleData);
      alert('Schedule updated successfully');
      closeForm();
    } catch (err) {
      console.error('Failed to update schedule:', err);
      alert('Failed to update schedule');
    }
  };

  const clearForm = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
    setSubject('');
    setAdditionalNote('');
  };

  return (
    <div className='schedule-container'>
      <h3 className="schedule-title">Update Schedule for {classroom.name}</h3>
      <p><strong>Note: </strong>Use the same <mark>Date & Subject</mark> to re-update the Existing Schedule </p>
      <div style={{ marginBottom: '15px' }}>
        <label  className="schedule-label">
          Date:
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="schedule-input"
          />
        </label>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label  className="schedule-label">
          Subject:
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="schedule-input"
          />
        </label>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label  className="schedule-label">
          Additional Note:
          <textarea
            value={additionalNote}
            onChange={(e) => setAdditionalNote(e.target.value)}
            className="schedule-input"
          />
        </label>
      </div>

      <div style={{ textAlign: 'left' }}>
        <button
          onClick={submitScheduleDetails}
         className="schedule-submit"
        >
          Submit
        </button>

        <button
          onClick={clearForm}
         className="schedule-clear"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default ScheduleUpdateForm;
