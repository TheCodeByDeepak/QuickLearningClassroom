import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';
import './CSS/ScheduleDetails.css'

const ScheduleDetails = ({ classroomId }) => {
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchDate, setSearchDate] = useState(''); // State for search term (date)
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/schedule/getScheduleByClassroomId?classroomId=${classroomId}`
        );
        setScheduleData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching schedule data:', err);
        setError(err);
        setLoading(false);
      }
    };

    if (classroomId) {
      fetchScheduleData();
    }
  }, [classroomId]);

  const handleDateChange = (e) => {
    setSearchDate(e.target.value); // Set the selected date
  };

  const handleClearSearch = () => {
    setSearchDate(''); // Clear the selected date and show all schedules
  };

  // Filter schedules only if a date is selected, otherwise show all schedules
  const filteredSchedule = searchDate
    ? scheduleData.filter(
        (schedule) =>
          schedule.date === searchDate // Compare the date
      )
    : scheduleData; // If no date is selected, show all schedules

  const handleDeleteSchedule = async (date, subject) => {
    // Optimistically update the UI by immediately removing the schedule
    setScheduleData((prevSchedule) =>
      prevSchedule.filter(
        (schedule) => !(schedule.date === date && schedule.subject === subject)
      )
    );

    try {
      const response = await axios.delete(
        'http://localhost:5000/api/schedule/deleteSchedule',
        {
          data: {
            classroomId,
            date,
            subject,
          },
        }
      );
      console.log(response.data.message);

      // Set success message
      setSuccessMessage('Schedule deleted successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting schedule:', error);

      // Revert UI changes if the request fails
      setScheduleData((prevSchedule) => [
        ...prevSchedule,
        { date, subject },
      ]);
    }
  };

  if (loading) return <p>Loading schedule data...</p>;
  if (error) return <p>No schedule data.</p>;

  return (
    <div>
      <h3>Schedule Details</h3>

      {/* Success message */}
      {successMessage && (
        <p style={{ color: 'green', fontWeight: 'bold' }}>
          {successMessage}
        </p>
      )}

      {/* Date Picker for selecting a date */}
      <div className="date-picker-container">
        <input
          type="date"
          value={searchDate}
          onChange={handleDateChange}
           className="date-input"
        />
        {/* Clear Button */}
        <button
          onClick={handleClearSearch}
          className="clear-button"
        >
          Clear
        </button>
      </div>

      {/* Table displaying schedule details */}
      <table
        className="schedule-table"
      >
        <thead>
          <tr>
            <th>Date</th>
            <th>Subject</th>
            <th>Additional Notes</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {filteredSchedule.length === 0 ? (
            <tr>
              <td colSpan="4">No schedule details found for this date.</td>
            </tr>
          ) : (
            filteredSchedule.map((schedule, index) => (
              <tr key={index}>
                <td>{schedule.date}</td>
                <td>{schedule.subject}</td>
                <td>{schedule.notes}</td>
                <td>
                  <button
                    onClick={() =>
                      handleDeleteSchedule(schedule.date, schedule.subject)
                    }
                    style={{
                      color: 'red',
                      fontSize: '24px',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleDetails;
