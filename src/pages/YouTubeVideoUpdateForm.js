import React, { useState } from 'react';
import axios from 'axios';
import './CSS/YouTubeVideoUpdateForm.css'

const YouTubeVideoUpdateForm = ({ classroom, closeForm }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [videoLink, setVideoLink] = useState('');

  const submitVideoDetails = async () => {
    if (!subject.trim()) {
      alert('Subject is required.');
      return;
    }
    if (!description.trim()) {
      alert('Description is required.');
      return;
    }

    const videoData = {
      classroomName: classroom.name,
      classroomId: classroom._id,
      date: selectedDate,
      subject,
      description,
      videoLink,
    };

    try {
      await axios.post('http://localhost:5000/api/upload-video', videoData);
      alert('Video details updated successfully');
      closeForm();
    } catch (err) {
      console.error('Failed to update video details:', err);
      alert('Failed to update video details');
    }
  };

  const clearForm = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
    setSubject('');
    setDescription('');
    setVideoLink('');
  };

  return (
    <div className='youtube-container'>
      <h3 className="youtube-title">Update YouTube Video for {classroom.name}</h3>
      <p><strong>Note: </strong>Use the same <mark>Date & Video Link</mark> to re-update the Existing YouTube Video </p>
      <div>
        <label className="youtube-label">
          Date:
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
             className="youtube-input"
          />
        </label>
      </div>

      <div className="youtube-label">
        <label style={{ display: 'block', marginBottom: '8px' }}>
          Subject:
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
             className="youtube-input"
          />
        </label>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label className="youtube-label">
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
             className="youtube-input"
          />
        </label>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px' }}>
          YouTube Video Link:
          <input
            type="url"
            placeholder="https://www.youtube.com/watch?v=example"
            value={videoLink}
            onChange={(e) => setVideoLink(e.target.value)}
             className="youtube-input"
          />
        </label>
      </div>

      <div style={{ textAlign: 'left' }}>
        <button
          onClick={submitVideoDetails}
         className="youtube-submit"
        >
          Submit
        </button>

        <button
          onClick={clearForm}
         className="youtube-clear"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default YouTubeVideoUpdateForm;
