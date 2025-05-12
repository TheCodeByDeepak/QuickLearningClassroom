import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CSS/CreateClassroom.css'

const CreateClassroom = ({ faculties, setMessage, setError, fetchClassrooms }) => {
  const [newClassroom, setNewClassroom] = useState({
    name: '',
    subject: '',
    startTiming: '',
    endTiming: '',
    facultyIds: [],
    joinCode: ''
  });

  const [visibleMessage, setVisibleMessage] = useState('');
  const [visibleError, setVisibleError] = useState('');

  // Effect to hide success messages after 3 seconds
  useEffect(() => {
    if (visibleMessage) {
      const timer = setTimeout(() => {
        setVisibleMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visibleMessage]);

  // Effect to hide error messages after 3 seconds
  useEffect(() => {
    if (visibleError) {
      const timer = setTimeout(() => {
        setVisibleError('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visibleError]);

  const handleCreateClassroom = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/classrooms/create',
        {
          ...newClassroom,
          code: newClassroom.joinCode
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      fetchClassrooms();
      setVisibleMessage('Classroom created successfully');
      setNewClassroom({
        name: '',
        subject: '',
        startTiming: '',
        endTiming: '',
        facultyIds: [],
        joinCode: ''
      });
    } catch (err) {
      setVisibleError('Failed to create classroom');
    }
  };

  const handleFacultyChange = (facultyId) => {
    setNewClassroom((prev) => {
      const facultyIds = prev.facultyIds.includes(facultyId)
        ? prev.facultyIds.filter((id) => id !== facultyId)
        : [...prev.facultyIds, facultyId];
      return { ...prev, facultyIds };
    });
  };

  return (
    <div >
      {/* Display success message */}
      {visibleMessage && <p style={{ color: 'green' }}>{visibleMessage}</p>}

      {/* Display error message */}
      {visibleError && <p style={{ color: 'red' }}>{visibleError}</p>}
      <div className="createclassroom-container">
      <h2 className="createclassroom-title">Create Classroom</h2>
      <form onSubmit={handleCreateClassroom}>
        <div>
          <label className="createclassroom-label">Classroom Name: </label><div>
          <input
            type="text"
            value={newClassroom.name}
            onChange={(e) => setNewClassroom({ ...newClassroom, name: e.target.value })}
            required 
            className="createclassroom-input"
          /></div>
        </div>
        <div>
          <div style={{marginTop:'10px', marginBottom:'-8px'}}><label className="createclassroom-label">Subject: </label></div><div>
          <input
            type="text"
            value={newClassroom.subject}
            onChange={(e) => setNewClassroom({ ...newClassroom, subject: e.target.value })}
            required style={{ marginTop: '10px' }}
            className="createclassroom-input"
          /></div>
        </div>
        <div>
          <label className="createclassroom-label">Start Timing: </label>
          <input
            type="time"
            value={newClassroom.startTiming}
            onChange={(e) => setNewClassroom({ ...newClassroom, startTiming: e.target.value })}
            required style={{ marginTop: '10px' }}
             className="createclassroom-input-time"
          />
        </div>
        <div>
          <label className="createclassroom-label">End Timing: </label>
          <input
            type="time"
            value={newClassroom.endTiming}
            onChange={(e) => setNewClassroom({ ...newClassroom, endTiming: e.target.value })}
            required style={{ marginTop: '10px', marginBottom: '10px' }}
             className="createclassroom-input-time-end"
          />
        </div>
        <div>
          <label className="createclassroom-label">Join Code: </label><div>
          <input
            type="text"
            value={newClassroom.joinCode}
            onChange={(e) => setNewClassroom({ ...newClassroom, joinCode: e.target.value })}
            required style={{ marginTop: '3px', marginBottom: '7px' }}
             className="createclassroom-input"
          /></div>
        </div>
        <div>
          <label className="createclassroom-label">Assign Faculties:</label>
          <div>
            {faculties.map((faculty) => (
              <div key={faculty._id}>
                <label className="createclassroom-label-selectfaculty">
                  <input
                    type="checkbox"
                    value={faculty._id}
                    checked={newClassroom.facultyIds.includes(faculty._id)}
                    onChange={() => handleFacultyChange(faculty._id)} style={{ marginTop: '10px' }}
                    className="custom-checkbox-createclassroom"
                  />
                  {faculty.username}
                </label>
              </div>
            ))}
          </div>
        </div>
        <button type="submit"  className="createclassroom-create" >Create Classroom</button>
      </form></div>
    </div>
  );
};

export default CreateClassroom;
