import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../CSS/ScheduleDetailsStudent.css'

const ScheduleDetails = ({ classroomId }) => {
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchDate, setSearchDate] = useState(''); // State for search term (date)

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

  if (loading) return <p>Loading schedule data...</p>;
  if (error) return <p>No schedule data.</p>;

  return (
    <div>
      <h3>Schedule Details</h3>

      {/* Date Picker for selecting a date */}
<div className="date-picker-container">
  <input
    type="date"
    value={searchDate}
    onChange={handleDateChange}
    className="date-input"
  />
  {/* Clear Button */}
  <button onClick={handleClearSearch} className="clear-button">
    Clear
  </button>
</div>


<table className="schedule-table">
  <thead>
    <tr>
      <th>Date</th>
      <th>Subject</th>
      <th>Additional Notes</th>
    </tr>
  </thead>
  <tbody>
    {filteredSchedule.length === 0 ? (
      <tr>
        <td colSpan="3">No schedule details found for this date.</td>
      </tr>
    ) : (
      filteredSchedule.map((schedule, index) => (
        <tr key={index}>
          <td>{schedule.date}</td>
          <td>{schedule.subject}</td>
          <td>{schedule.notes}</td>
        </tr>
      ))
    )}
  </tbody>
</table>

    </div>
  );
};

export default ScheduleDetails;
