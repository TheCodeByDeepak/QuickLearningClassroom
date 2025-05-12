import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import '../CSS/AttendanceDataStudent.css'

const AttendanceData = ({ classroomId, studentId }) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showPieChart, setShowPieChart] = useState(false); // Set to false initially
  const [showAttendanceTable, setShowAttendanceTable] = useState(false); // Set to false initially



  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        let response;
        if (studentId) {
          response = await axios.get(
            `http://localhost:5000/api/attendance/fetchAttendanceByStudent?classroomId=${classroomId}&studentId=${studentId}`
          );
        } else {
          response = await axios.get(
            `http://localhost:5000/api/attendance/fetchAttendanceData?classroomId=${classroomId}`
          );
        }

        setAttendanceData(response.data);
        setFilteredData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching attendance data:', err);
        setError(err);
        setLoading(false);
      }
    };

    if (classroomId) {
      fetchAttendanceData();
    }
  }, [classroomId, studentId]);

  const handleFilter = () => {
    const filtered = attendanceData.filter((record) => {
      const date = new Date(record[1]);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      const matchesDate =
        (!start || date >= start) && (!end || date <= end);
      const matchesStatus = statusFilter
        ? record[2].toLowerCase() === statusFilter.toLowerCase()
        : true;

      return matchesDate && matchesStatus;
    });
    setFilteredData(filtered);
  };

  const handleClearFilter = () => {
    setStartDate('');
    setEndDate('');
    setStatusFilter('');
    setFilteredData(attendanceData); // Reset to all data
  };

  const calculateTotals = () => {
    const counts = {
      Present: 0,
      Absent: 0,
      Late: 0,
      Holiday: 0,
    };

    filteredData.forEach((record) => {
      const status = record[2]; // Assuming status is in the third column
      if (counts[status] !== undefined) {
        counts[status] += 1;
      }
    });

    return counts;
  };

  const totals = calculateTotals();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>No attendance records found for this student</p>;

  // Sort filtered attendance data by date (assuming date is in the second column, index 1)
  const sortedFilteredData = filteredData.sort((a, b) => {
    const dateA = new Date(a[1]);
    const dateB = new Date(b[1]);
    return dateB - dateA; // Sort in descending order
  });

  // Toggle the visibility of Pie Chart
  const handleTogglePieChart = () => {
    setShowPieChart(!showPieChart); // Toggle Pie Chart visibility
    if (showAttendanceTable) setShowAttendanceTable(false); // Hide Attendance Table if it's visible
  };

  // Toggle the visibility of Attendance Data
  const handleToggleAttendanceData = () => {
    setShowAttendanceTable(!showAttendanceTable); // Toggle Attendance Table visibility
    if (showPieChart) setShowPieChart(false); // Hide Pie Chart if it's visible
  };

  const pieChartData = [
    { name: 'Present', value: totals.Present + totals.Late },
    { name: 'Absent', value: totals.Absent },
    { name: 'Late', value: totals.Late },
    { name: 'Holiday', value: totals.Holiday },
  ];

  return (
    <div>
      <h3>Attendance Data</h3>

      {/* Filter Options */}
      <div className="filter-container">
  <label className="filter-label">Start Date:</label>
  <input 
    type="date" 
    value={startDate} 
    onChange={(e) => setStartDate(e.target.value)} 
    className="filter-input start-date"
  />

  <label className="filter-label">End Date:</label>
  <input 
    type="date" 
    value={endDate} 
    onChange={(e) => setEndDate(e.target.value)} 
    className="filter-input end-date"
  />

  <label className="filter-label">Status:</label>
  <select 
    value={statusFilter} 
    onChange={(e) => setStatusFilter(e.target.value)} 
    className="filter-select status-filter"
  >
    <option value="">All</option>
    <option value="Present">Present</option>
    <option value="Absent">Absent</option>
    <option value="Late">Late</option>
    <option value="Holiday">Holiday</option>
  </select>

  <button onClick={handleFilter} className="filter-button">Filter</button>
  <button onClick={handleClearFilter} className="filter-button">Clear Filter</button>
  <button onClick={handleTogglePieChart} className="filter-button">
    {showPieChart ? 'Hide Pie Chart' : 'Show Pie Chart'}
  </button>
  <button onClick={handleToggleAttendanceData} className="filter-button">
    {showAttendanceTable ? 'Hide Attendance Data' : 'Show Attendance Data'}
  </button>
</div>

<div style={{ marginBottom: '20px', fontWeight: 'bold' }}>
        <pre style={{ fontSize: '18px', fontWeight: 'bold', lineHeight: '1.5' }}>
          Total Present: {totals.Present + totals.Late}   Total Absent: {totals.Absent}   Total Late: {totals.Late}   Total Holiday: {totals.Holiday}
        </pre>
      </div>


      {/* Pie Chart */}
      {showPieChart && (
        <PieChart width={300} height={300}>
          <Pie
            data={pieChartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label
          >
            {pieChartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      )}

      {/* Table displaying attendance data */}
      {showAttendanceTable && ( 
  <table className="attendance-table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Date</th>
        <th>Status</th>
        <th>Note</th>
      </tr>
    </thead>
    <tbody>
      {sortedFilteredData.map((row, index) => (
        <tr key={index}>
          {row.slice(0, 4).map((cell, cellIndex) => (
            <td key={cellIndex}>{cell}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
)}

    </div>
  );
};

export default AttendanceData;
