import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa'; // Importing the delete icon
import './CSS/HomeworkData.css'

const HomeworkData = ({ classroomId, studentId }) => {
  const [homeworkData, setHomeworkData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [descriptionFilter, setDescriptionFilter] = useState('');
  const [showHomework, setShowHomework] = useState(false); // Toggle homework display
  const [successMessage, setSuccessMessage] = useState(''); // Success message state

  useEffect(() => {
    const fetchHomeworkData = async () => {
      try {
        let response;
        if (studentId) {
          response = await axios.get(
            `http://localhost:5000/api/homework/fetchHomeworkByStudent?classroomId=${classroomId}&studentId=${studentId}`
          );
        } else {
          response = await axios.get(
            `http://localhost:5000/api/homework/fetchHomeworkData?classroomId=${classroomId}`
          );
        }

        const transformedData = response.data.map((record) => ({
          classroomName: record.classroomName || 'N/A',
          studentName: record.studentName || 'N/A',
          startDate: record.startDate || 'N/A',
          startTime: record.startTime || 'N/A',
          endDate: record.endDate || 'N/A',
          endTime: record.endTime || 'N/A',
          description: record.description || 'N/A',
          remark: record.remark || 'N/A',
          status: record.status || 'Not Submitted',
          studentId: record.studentId, // Add studentId
        }));

        setHomeworkData(transformedData);
        setFilteredData(transformedData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching homework data:', err);
        setError(err);
        setLoading(false);
      }
    };

    if (classroomId) {
      fetchHomeworkData();
    }
  }, [classroomId, studentId]);

  const handleFilter = () => {
    const filtered = homeworkData.filter((record) => {
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      const matchesDate =
        (!start || new Date(record.startDate) >= start) &&
        (!end || new Date(record.endDate) <= end);
      const matchesDescription = descriptionFilter
        ? record.description.toLowerCase().includes(descriptionFilter.toLowerCase())
        : true;

      return matchesDate && matchesDescription;
    });
    setFilteredData(filtered);
  };

  const handleClearFilter = () => {
    setStartDate('');
    setEndDate('');
    setDescriptionFilter('');
    setFilteredData(homeworkData);
  };

  const handleShowHomework = () => {
    setShowHomework(!showHomework); // Toggle homework display
  };

  // Handle delete functionality
  const handleDelete = async (startDate, endDate, studentId) => {
    try {
      const response = await axios.delete(
        "http://localhost:5000/api/homework/deleteHomework",
        {
          data: {
            classroomId,  // Classroom ID
            studentId,    // Student ID
            startDate,    // Start Date
            endDate       // End Date
          }
        }
      );

      console.log('Delete Success:', response.data);
      const updatedData = homeworkData.filter(
        (record) =>
          record.startDate !== startDate ||
          record.endDate !== endDate ||
          record.studentId !== studentId
      );
      setHomeworkData(updatedData);
      setFilteredData(updatedData);

      // Set success message
      setSuccessMessage('Homework data deleted successfully');
      
      // Clear the success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);

    } catch (err) {
      console.error("Error deleting homework:", err);
      setError("Error deleting homework");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>No homework data found for this student</p>;

  return (
    <div>
      <h3>Homework Data</h3>

      {/* Display success message */}
      {successMessage && <p style={{ color: 'green', fontWeight: 'bold' }}>{successMessage}</p>}

      {/* Filter Options */}
      <div  className="filter-container">
        <label className="filter-label">Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="filter-input"
        />
        <label className="filter-label">End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="filter-input"
        />
        <input
          type="text"
          placeholder="Search by description"
          value={descriptionFilter}
          onChange={(e) => setDescriptionFilter(e.target.value)}
          className="filter-input"
        />
        <button onClick={handleFilter} className="filter-button">
          Filter
        </button>
        <button onClick={handleClearFilter} className="filter-button">
          Clear Filter
        </button>
        <button onClick={handleShowHomework} className="filter-button">
          {showHomework ? 'Hide Homework' : 'Show Homework'}
        </button>
      </div>

      {/* Table displaying homework data */}
      {showHomework && (
        <>
          {filteredData.length === 0 ? (
            <p>No records found based on the applied filters</p>
          ) : (
            <table
             className="assignment-table"
            >
              <thead>
                <tr>
                  <th>Classroom Name</th>
                  <th>Student Name</th>
                  <th>Start Date</th>
                  <th>Start Time</th>
                  <th>End Date</th>
                  <th>End Time</th>
                  <th>Description</th>
                  <th>Remark</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((record, index) => (
                  <tr key={index}>
                    <td>{record.classroomName}</td>
                    <td>{record.studentName}</td>
                    <td>{record.startDate}</td>
                    <td>{record.startTime}</td>
                    <td>{record.endDate}</td>
                    <td>{record.endTime}</td>
                    <td>{record.description}</td>
                    <td>{record.remark}</td>
                    <td>{record.status}</td>
                    <td>
                      <FaTrash
                        style={{
                          cursor: 'pointer',
                          color: 'red',
                          fontSize: '20px',
                        }}
                        onClick={() =>
                          handleDelete(record.startDate, record.endDate, record.studentId)
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};

export default HomeworkData;
