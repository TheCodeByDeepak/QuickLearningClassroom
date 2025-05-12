import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CSS/BlacklistForm.css'

const BlacklistForm = ({ classroomId, student, closeForm }) => {
  const [blacklistDetails, setBlacklistDetails] = useState({
    date: new Date().toISOString().split('T')[0], // Default to today's date
    reason: '',
    additionalNote: '',
  });

  const [classroomName, setClassroomName] = useState(''); // State to store the classroom name

  useEffect(() => {
    if (!classroomId) {
      console.error('classroomId is not provided!');
      return;
    }

    const fetchClassroomDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/classrooms/${classroomId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setClassroomName(response.data.name);
      } catch (error) {
        console.error('Failed to fetch classroom name:', error);
      }
    };

    fetchClassroomDetails();
  }, [classroomId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlacklistDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitBlacklistDetails = async () => {
    const { date, reason, additionalNote } = blacklistDetails;
  
    // Validation
    if (!date || !reason) {
      alert('Please fill out all required fields.');
      return;
    }
  
    const payload = {
      classroomId: classroomId,
      classroomName: classroomName, // Include the classroom name
      studentId: student._id,
      studentName: student.username,
      date,
      reason,
      additionalNote,
    };
  
    console.log('Payload being sent:', payload); // Log the payload to check its structure
  
    try {
      await axios.post('http://localhost:5000/api/blacklist/submit-blacklist', payload);
      alert('Blacklist data submitted successfully!');
      closeForm();
    } catch (error) {
      console.error('Error submitting blacklist data:', error.response ? error.response.data : error.message);
      alert('Failed to submit blacklist data.');
    }
  };
  

  return (
    <div className='blacklistform-container'>
      <h3 className="blacklistform-title">
        Update Blacklist Data for {student.username} ({classroomName || 'Loading classroom name...'})
      </h3>
      <p><strong>Note: </strong>Use the same <mark>Date</mark> to re-update the Existing Blacklist </p>
      <form>
        <label className="blacklistform-label">
          Date:<div>
          <input
            type="date"
            name="date"
            value={blacklistDetails.date}
            onChange={handleChange}
            required
            className='blaclistform-input'
          /></div>
        </label>
        <br />
        <label className="blacklistform-label">
          Reason:<div>
          <input
            type="text"
            name="reason"
            value={blacklistDetails.reason}
            onChange={handleChange}
            required
             className='blaclistform-input'
          /></div>
        </label>
        <br />
        <label className="blacklistform-label">
          Additional Note:<div>
          <input
            type="text"
            name="additionalNote"
            value={blacklistDetails.additionalNote}
            onChange={handleChange}
            className='blaclistform-input'
          /></div>
        </label>
        <br />
        <button
          type="button"
          onClick={submitBlacklistDetails}
          className="blacklistform-submit"
        >
          Submit
        </button>
        <button
          type="button"
          onClick={closeForm}
          className="blacklistcancel-submit"
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default BlacklistForm;
