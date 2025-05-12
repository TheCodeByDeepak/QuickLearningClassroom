import React, { useState } from 'react';
import axios from 'axios';
import './CSS/GoogleMeetLinkForm.css'

const GoogleMeetLinkForm = ({ classroom, closeForm }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [liveLink, setLiveLink] = useState('');

  const submitGoogleMeetLink = async () => {
    if (!note.trim()) {
      alert('Note is required.');
      return;
    }
    if (!liveLink.trim()) {
      alert('Live Link is required.');
      return;
    }

    const formData = {
      classroomName: classroom.name,
      classroomId: classroom._id,
      date: selectedDate,
      note,
      liveLink,
    };

    try {
      await axios.post('http://localhost:5000/api/update-google-meet-link', formData);
      alert('Google Meet link updated successfully');
      closeForm();
    } catch (err) {
      console.error('Failed to update Google Meet link:', err);
      alert('Failed to update Google Meet link');
    }
  };

  const clearForm = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
    setNote('');
    setLiveLink('');
  };

  return (
    <div className='live-container'>
      <h3 className="live-title">Update Google Meet Link for {classroom.name}</h3>
      <p><strong>Note: </strong>Use the same <mark>Date</mark> to re-update the Existing Live Lecture Details </p>
      <div style={{ marginBottom: '15px' }}>
        <label className="live-label">
          Date:<div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="live-input"
          /></div>
        </label>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label className="live-label">
          Note:<div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
          className="live-input"
          /></div>
        </label>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label className="live-label">
          Live Link:<div>
          <input
            type="url"
            placeholder="https://meet.google.com/your-link"
            value={liveLink}
            onChange={(e) => setLiveLink(e.target.value)}
           className="live-input"
          /></div>
        </label>
      </div>

      <div style={{ textAlign: 'left' }}>
        <button
          onClick={submitGoogleMeetLink}
         className="live-submit"
        >
          Submit
        </button>

        <button
          onClick={clearForm}
         className="live-clear"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default GoogleMeetLinkForm;
