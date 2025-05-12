import React, { useState } from 'react';
import axios from 'axios';
import '../pages/CSS/UpdateClassroomDetails.css'

const UpdateClassroomDetails = () => {
  const [classroomId, setClassroomId] = useState('');
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [startTiming, setStartTiming] = useState('');
  const [endTiming, setEndTiming] = useState('');
  const [code, setCode] = useState('');
  const [action, setAction] = useState('update'); // new state for action selection
  const [isCopied, setIsCopied] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'classroomId') setClassroomId(value);
    else if (name === 'name') setName(value);
    else if (name === 'subject') setSubject(value);
    else if (name === 'startTiming') setStartTiming(value);
    else if (name === 'endTiming') setEndTiming(value);
    else if (name === 'code') setCode(value);
  };

  const handleUpdateDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
  
      // Create an object with only the fields that have been changed
      const updatedDetails = {};
      if (name) updatedDetails.name = name;
      if (subject) updatedDetails.subject = subject;
      if (startTiming) updatedDetails.startTiming = startTiming;
      if (endTiming) updatedDetails.endTiming = endTiming;
      if (code) updatedDetails.code = code;
  
      await axios.put(
        `http://localhost:5000/api/classrooms/update/${classroomId}`,
        updatedDetails,
        config
      );
  
      alert('Classroom details updated successfully');
      resetForm();
    } catch (error) {
      console.error('Error response:', error.response);
      alert('Error updating classroom details: ' + (error.response?.data || 'Unknown error'));
    }
  };

  const handleDeleteClassroom = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
  
      await axios.delete(
        `http://localhost:5000/api/classrooms/deleteClassroom/${classroomId}`,
        config
      );
  
      alert('Classroom deleted successfully');
      resetForm();
    } catch (error) {
      console.error('Error response:', error.response);
      alert('Error deleting classroom: ' + (error.response?.data || 'Unknown error'));
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setClassroomId(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    } catch (error) {
      console.error('Failed to read clipboard contents: ', error);
    }
  };

  const resetForm = () => {
    setClassroomId('');
    setName('');
    setSubject('');
    setStartTiming('');
    setEndTiming('');
    setCode('');
    setAction('update');
  };

  const handleAction = () => {
    if (action === 'update') {
      handleUpdateDetails();
    } else if (action === 'delete') {
      handleDeleteClassroom();
    }
  };

  return (
    <div className="updateclassroom-container">
      <h2 className="updateclassroom-title">Update or Delete Classroom Details</h2>
      <p><strong>Note: </strong>Use the <mark>Classroom ID</mark> to re-update or delete the Existing Classroom </p>
      <div>
        <label htmlFor="classroomIdInput" className="updateclassroom-label">Enter Classroom ID: </label><br />
        <input
          id="classroomIdInput"
          name="classroomId"
          type="text"
          value={classroomId}
          onChange={handleInputChange}
          placeholder="Enter classroom ID"
          className="updateclassroom-input"
        />
        <button onClick={handlePaste} className="updateclassroom-paste">
          Paste ID
        </button>
        {isCopied && <span style={{ color: 'green', marginLeft: '10px' }}>Pasted!</span>}
      </div>

      <div style={{ marginTop: '12px' }}>
        <label htmlFor="nameInput" className="updateclassroom-label">Classroom Name: </label><br />
        <input
          id="nameInput"
          name="name"
          type="text"
          value={name}
          onChange={handleInputChange}
          placeholder="Enter classroom name"
          className="updateclassroom-input"
        />
      </div>

      <div style={{ marginTop: '12px' }}>
        <label htmlFor="subjectInput" className="updateclassroom-label">Subject: </label><br />
        <input
          id="subjectInput"
          name="subject"
          type="text"
          value={subject}
          onChange={handleInputChange}
          placeholder="Enter subject"
          className="updateclassroom-input"
        />
      </div>

      <div style={{ marginTop: '12px' }}>
        <label htmlFor="startTimingInput" className="updateclassroom-label">Start Time: </label>
        <input
          id="startTimingInput"
          name="startTiming"
          type="time"
          value={startTiming}
          onChange={handleInputChange}
          className="updateclassroom-input-time"
        />
      </div>

      <div style={{ marginTop: '12px' }}>
        <label htmlFor="endTimingInput" className="updateclassroom-label">End Time: </label>
        <input
          id="endTimingInput"
          name="endTiming"
          type="time"
          value={endTiming}
          onChange={handleInputChange}
           className="updateclassroom-input-time-end"
        />
      </div>

      <div style={{ marginTop: '12px' }}>
        <label htmlFor="codeInput" className="updateclassroom-label">Join code: </label><br />
        <input
          id="codeInput"
          name="code"
          type="text"
          value={code}
          onChange={handleInputChange}
          placeholder="Enter Join Code"
          className="updateclassroom-input"
        />
      </div>

      <div style={{ marginTop: '12px' }}>
        <label htmlFor="actionSelect" className="updateclassroom-label">Action: </label><br />
        <select
          id="actionSelect"
          value={action}
          onChange={(e) => setAction(e.target.value)}
           className="updateclassroom-select"
        >
          <option value="update">Update</option>
          <option value="delete">Delete</option>
        </select>
      </div>

      <div style={{ marginTop: '12px' }}>
        <button onClick={handleAction} className="updateclassroom-submit">
          {action === 'update' ? 'Update Classroom Details' : 'Delete Classroom'}
        </button>
      </div>
    </div>
  );
};

export default UpdateClassroomDetails;
