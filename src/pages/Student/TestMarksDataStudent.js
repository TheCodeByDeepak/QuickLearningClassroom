import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../CSS/TestMarksDataStudent.css'

const TestMarksData = ({ classroomId, studentId }) => {
  const [testData, setTestData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [testTypeFilter, setTestTypeFilter] = useState('');
  const [showGraph, setShowGraph] = useState(false); // State to toggle graph display
  const [showMarks, setShowMarks] = useState(false); // State to toggle marks table display

  useEffect(() => {
    const fetchTestData = async () => {
      try {
        let response;
        if (studentId) {
          response = await axios.get(
            `http://localhost:5000/api/testmarks/fetchTestMarksByStudent?classroomId=${classroomId}&studentId=${studentId}`
          );
        } else {
          response = await axios.get(
            `http://localhost:5000/api/testmarks/fetchTestMarks?classroomId=${classroomId}`
          );
        }

        const transformedData = response.data.map((record) => ({
          name: record[0] || 'N/A',
          date: record[1] || 'N/A',
          testType: record[2] || 'N/A',
          subject: record[3] || 'N/A',
          obtainedMarks: record[4] || 0,
          totalMarks: record[5] || 0,
          note: record[6] || 'N/A',
          dateSubject: `${record[1] || 'N/A'} - ${record[3] || 'N/A'}`, // Combine date and subject
          rank: record[7] || 'N/A',
studentId: record[8],
	
        }));
        

        setTestData(transformedData);
        setFilteredData(transformedData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching test marks data:', err);
        setError(err);
        setLoading(false);
      }
    };

    if (classroomId) {
      fetchTestData();
    }
  }, [classroomId, studentId]);

  const handleFilter = () => {
    const filtered = testData.filter((record) => {
      const date = new Date(record.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      const matchesDate = (!start || date >= start) && (!end || date <= end);
      const matchesTestType = testTypeFilter
        ? record.testType.toLowerCase() === testTypeFilter.toLowerCase()
        : true;

      return matchesDate && matchesTestType;
    });
    setFilteredData(filtered);
  };

  const handleClearFilter = () => {
    setStartDate('');
    setEndDate('');
    setTestTypeFilter('');
    setFilteredData(testData);
  };

  const handleShowGraph = () => {
    setShowGraph(!showGraph); // Toggle graph display
    setShowMarks(false); // Hide marks when showing graph
  };

  const handleShowMarks = () => {
    setShowMarks(!showMarks); // Toggle marks display
    setShowGraph(false); // Hide graph when showing marks
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>No test marks data found for this student</p>;

  return (
    <div>
      <h3>Test Marks Data</h3>

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
  
  <button onClick={handleFilter} className="filter-button">
    Filter
  </button>
  <button onClick={handleClearFilter} className="filter-button">
    Clear Filter
  </button>
  <button onClick={handleShowGraph} className="filter-button">
    {showGraph ? 'Hide Graph' : 'Show Graph'}
  </button>
  <button onClick={handleShowMarks} className="filter-button">
    {showMarks ? 'Hide Marks' : 'Show Marks'}
  </button>
</div>


      {/* Line Graph */}
      {showGraph && (
        <ResponsiveContainer width="80%" height={400}>
          <LineChart
            data={filteredData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="obtainedMarks" stroke="#8884d8" />
            <Line type="monotone" dataKey="totalMarks" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      )}

      {/* Table displaying test marks data */}
      {showMarks && (
        <>
          {filteredData.length === 0 ? (
            <p>No records found based on the applied filters</p>
          ) : (
            <table
             className="test-table"
            >
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Test Type</th>
                  <th>Subject</th>
                  <th>Marks Obtained</th>
                  <th>Total Marks</th>
                  <th>Additional Note</th>
                  <th>Rank</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((record, index) => (
                  <tr key={index}>
                    <td>{record.name}</td>
                    <td>{record.date}</td>
                    <td>{record.testType}</td>
                    <td>{record.subject}</td>
                    <td>{record.obtainedMarks}</td>
                    <td>{record.totalMarks}</td>
                    <td>{record.note}</td>
                    <td>{record.rank}</td>
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

export default TestMarksData;
