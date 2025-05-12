import React, { useState } from 'react';
import axios from 'axios';
import './CSS/ClassroomDataForm.css'

const ClassroomDataForm = ({ classroom, closeForm }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [formLink, setFormLink] = useState('');

  const submitFormData = async () => {
    if (!topic.trim()) {
      alert('Topic is required.');
      return;
    }
    if (!description.trim()) {
      alert('Description is required.');
      return;
    }
    if (!formLink.trim()) {
      alert('Form Link is required.');
      return;
    }

    const formData = {
      classroomName: classroom.name,
      classroomId: classroom._id,
      date: selectedDate,
      topic,
      description,
      formLink,
    };

    try {
      await axios.post('http://localhost:5000/api/submit-form', formData);
      alert('Form data submitted successfully');
      closeForm();
    } catch (err) {
      console.error('Failed to submit form data:', err);
      alert('Failed to submit form data');
    }
  };

  const clearForm = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
    setTopic('');
    setDescription('');
    setFormLink('');
  };

  return (
    <div className='forms-container'>
      <h3 className="forms-title">Submit Form for {classroom.name}</h3>
      <p><strong>Note: </strong>Use the same <mark>Date & Form Link</mark> to re-update the Existing Form Details </p>
      <div style={{ marginBottom: '15px' }}>
        <label className="forms-label">
          Date:
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="forms-input"
          />
        </label>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label className="forms-label">
          Topic:
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="forms-input"
          />
        </label>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label className="forms-label">
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="forms-input"
          />
        </label>
      </div>

      <div>
        <label className="forms-label">
          Form Link:
          <input
            type="url"
            placeholder="https://example.com/form"
            value={formLink}
            onChange={(e) => setFormLink(e.target.value)}
            className="forms-input"
          />
        </label>
      </div>

      <div style={{ textAlign: 'left' }}>
        <button
          onClick={submitFormData}
         className='forms-submit'
        >
          Submit
        </button>

        <button
          onClick={clearForm}
          className='forms-clear'
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default ClassroomDataForm;
