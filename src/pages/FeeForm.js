import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CSS/FeeForm.css'

const FeeForm = ({ classroomId, student, closeForm }) => {
  const [feeDetails, setFeeDetails] = useState({
    receiptNo: '',
    date: new Date().toISOString().split('T')[0], // Default to today's date
    description: '',
    paymentMode: 'Cash',
    amountPaid: '',
    totalFees: '',
  });

  const [classroomName, setClassroomName] = useState(''); // State to store the classroom name

  // Fetch classroom details and classroom name similar to how it's done in AttendanceForm
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
        // Set the classroom name to state
        setClassroomName(response.data.name);
      } catch (error) {
        console.error('Failed to fetch classroom name:', error);
      }
    };

    fetchClassroomDetails();
  }, [classroomId]); // Depend on classroomId to trigger the effect when it changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeeDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitFeeDetails = async () => {
    const { receiptNo, date, description, paymentMode, amountPaid, totalFees } = feeDetails;

    // Validation
    if (!receiptNo || !amountPaid || !totalFees) {
      alert('Please fill out all required fields.');
      return;
    }

    const payload = {
      classroomId: classroomId,
      classroomName: classroomName, // Include the classroom name
      studentId: student._id,
      studentName: student.username,
      receiptNo,
      date,
      description,
      paymentMode,
      amountPaid,
      totalFees,
    };

    try {
      await axios.post('http://localhost:5000/api/submit-fee', payload);
      alert('Fee details submitted successfully!');
      closeForm();
    } catch (error) {
      console.error('Error submitting fee details:', error);
      alert('Failed to submit fee details.');
    }
  };

  return (
    <div className='feeform-container'>
      <h3 className='feeform-title'>
        Update Fee for {student.username} ({classroomName || 'Loading classroom name...'})
      </h3>
      <p><strong>Note: </strong>Use the same <mark>Receipt No</mark> to re-update the Existing Fee </p>
      <form>
        <label className='feeform-label'>
          Receipt No.:<div>
          <input
            type="text"
            name="receiptNo"
            value={feeDetails.receiptNo}
            onChange={handleChange}
            required
            className='feeform-input'
           
          /></div>
        </label>
      
        <label className='feeform-label'>
          Date:<div>
          <input
            type="date"
            name="date"
            value={feeDetails.date}
            onChange={handleChange}
            className='feeform-input-date'
          
          /></div>
        </label>
    
        <label className='feeform-label'>
          Description:<div>
          <input
            type="text"
            name="description"
            value={feeDetails.description}
            onChange={handleChange}
            className='feeform-input'
          
          /></div>
        </label>
       
        <label className='feeform-label'>
          Payment Mode:<div>
          <select
            name="paymentMode"
            value={feeDetails.paymentMode}
            onChange={handleChange}
            className='feeform-select'
            
          >
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
            <option value="Online">Online</option>
          </select></div>
        </label>
    
        <label className='feeform-label'>
          Amount Paid:<div>
          <input
            type="number"
            name="amountPaid"
            value={feeDetails.amountPaid}
            onChange={handleChange}
            required
            className='feeform-input'
           
          /></div>
        </label>
     
        <label className='feeform-label'>
          Total Fees:<div>
          <input
            type="number"
            name="totalFees"
            value={feeDetails.totalFees}
            onChange={handleChange}
            required
            className='feeform-input'
           
          /></div>
        </label>
 
        <button
          type="button"
          onClick={submitFeeDetails}
          className='feeform-submit'
        >
          Submit Fee
        </button>
        <button
          type="button"
          onClick={closeForm}
         className='feeform-cancel'
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default FeeForm;
