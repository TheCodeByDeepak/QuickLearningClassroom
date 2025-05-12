import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CSS/hwupload.css'

const HomeworkData = ({ classroomId, studentId }) => {
  const [homeworkData, setHomeworkData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [descriptionFilter, setDescriptionFilter] = useState('');
  const [showHomework, setShowHomework] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

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
          homeworkId: record._id,
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
        (!start || new Date(record.startDate) >= start) && (!end || new Date(record.endDate) <= end);
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
    setShowHomework(!showHomework);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const uploadHomework = async (homeworkId, startDate, endDate, startTime, endTime) => {
    if (!selectedFile) {
      alert('Please select a file to upload.');
      return;
    }

    // Get current date and time
    const currentDate = new Date();

    // Parse the start and end dates with times
    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);

    // Check if the current date/time is within the allowed range
    if (currentDate < startDateTime || currentDate > endDateTime) {
      alert('You can only upload homework between the specified start and end date/time.');
      return;
    }

    // Create a dynamic description based on start and end dates
    const description = `Homework for the period from ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`;

    // Prepare FormData for file upload
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('homeworkId', homeworkId); // Send homeworkId along with file
    formData.append('classroomId', classroomId); // Add classroomId
    formData.append('studentId', studentId); // Add studentId
    formData.append('description', description); // Add dynamic description

    try {
      setUploading(true);
      const response = await axios.post(
        'http://localhost:5000/api/homework/upload',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (response.data.success) {
        alert('Homework uploaded successfully');
        setSelectedFile(null); // Clear selected file
      } else {
        alert('Failed to upload homework: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error uploading homework:', error);
      alert('An error occurred while uploading the homework: ' + error.response?.data?.message || error.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>No homework data found for this student</p>;

  return (
    <div>
      <h3>Homework Data</h3>

      {/* Filter Options */}
      <div className="filter-container">
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
    className="search-input"
  />

  <button onClick={handleFilter} className="filter-button">Filter</button>
  <button onClick={handleClearFilter} className="filter-button">Clear Filter</button>
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
            <table className="hwupload-table">
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
                  <th>Upload Homework</th>
                  <th>Status</th>
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
                    <td>
                    <label className="custom-file-label">
        Choose File
        <input type="file" className="custom-file-input" onChange={handleFileChange} />
      </label>
                      <button
                        onClick={() => uploadHomework(record.homeworkId, record.startDate, record.endDate, record.startTime, record.endTime)}
                        disabled={uploading}
                        style={{
                          marginLeft: '5px',
                          padding: '5px 10px',
                          backgroundColor: '#4CAF50',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                      >
                        {uploading ? 'Uploading...' : 'Upload'}
                      </button>
                    </td>
                    <td>{record.status}</td>
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
