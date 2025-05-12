import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2"; // Importing Bar chart from Chart.js
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import '../CSS/FeeDataStudent.css'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const FeeData = ({ classroomId, studentId }) => {
  const [feeData, setFeeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredFeeData, setFilteredFeeData] = useState([]);
  const [showGraph, setShowGraph] = useState(false); // Initially set to false, so graph is hidden
  const [showTable, setShowTable] = useState(false); // Initially set to false, so table is hidden

  useEffect(() => {
    const fetchFeeData = async () => {
      try {
        let response;
        if (studentId) {
          response = await axios.get(
            `http://localhost:5000/api/fees/fetchFeeByStudent?classroomId=${classroomId}&studentId=${studentId}`
          );
        } else {
          response = await axios.get(
            `http://localhost:5000/api/fees/fetchFeeData?classroomId=${classroomId}`
          );
        }

        if (response.data && response.data.length === 0) {
          setError("No fee records found for this student in the specified classroom.");
        } else {
          setFeeData(response.data);
          setFilteredFeeData(response.data);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching fee data:", err);
        setError("No fee records found for this student in the specified classroom.");
        setLoading(false);
      }
    };

    if (classroomId) {
      fetchFeeData();
    }
  }, [classroomId, studentId]);

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleClearFilter = () => {
    setStartDate("");
    setEndDate("");
    setFilteredFeeData(feeData); // Reset the filter
  };

  const handleApplyFilter = () => {
    const filtered = feeData.filter((row) => {
      const feeDate = new Date(row[3]); // Assuming the date is in column 1 (index 1)

      if (startDate && feeDate < new Date(startDate)) return false;
      if (endDate && feeDate > new Date(endDate)) return false;
      return true;
    });

    setFilteredFeeData(filtered); // Apply the filtered fee data
  };

  const toggleGraphVisibility = () => {
    setShowGraph((prevState) => !prevState); // Toggle the visibility of the graph
    setShowTable(false); // Hide the table when graph is shown
  };

  const toggleTableVisibility = () => {
    setShowTable((prevState) => !prevState); // Toggle the visibility of the table
    setShowGraph(false); // Hide the graph when table is shown
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  // Calculate total fee, amount paid, and amount balance based on the original feeData (unfiltered)
  const totalFee = feeData.reduce((total, row) => total + parseFloat(row[7] || 0), 0); // Total Fees (column 5)
  const amountPaid = feeData.reduce((total, row) => total + parseFloat(row[6] || 0), 0); // Amount Paid (column 4)
  const amountBalance = totalFee - amountPaid; // Amount Balance

  // Data for the Bar Graph
  const barData = {
    labels: ["Total Fee", "Amount Paid", "Balance Amount"],
    datasets: [
      {
        label: "Fee Data",
        data: [totalFee, amountPaid, amountBalance],
        backgroundColor: ["rgba(54, 162, 235, 0.6)", "rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)"],
        borderColor: ["rgba(54, 162, 235, 1)", "rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false, // Prevent the chart from maintaining its aspect ratio
    plugins: {
      title: {
        display: true,
        text: "Fee Overview",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <h3>Fee Data for Student</h3>

      {/* Date Filters */}
      <div className="filter-container">
  <label htmlFor="startDate" className="filter-label">Start Date: </label>
  <input
    type="date"
    id="startDate"
    className="filter-input start-date"
    value={startDate}
    onChange={handleStartDateChange}
  />
  
  <label htmlFor="endDate" className="filter-label">End Date: </label>
  <input
    type="date"
    id="endDate"
    className="filter-input end-date"
    value={endDate}
    onChange={handleEndDateChange}
  />

  <button className="filter-button" onClick={handleApplyFilter}>Apply Filter</button>
  <button className="filter-button" onClick={handleClearFilter}>Clear Filter</button>

  <button className="filter-button" onClick={toggleGraphVisibility}>
    {showGraph ? "Hide Graph" : "Show Graph"}
  </button>

  <button className="filter-button" onClick={toggleTableVisibility}>
    {showTable ? "Hide Fee Data" : "Show Fee Data"}
  </button>
</div>



      {/* Fee Summary (one line, based on original data) */}
      <div>
        <h3>Fee Summary</h3>
        <p>
          <strong>Amount Paid: </strong> {amountPaid.toFixed(2)} &nbsp; | &nbsp;
          <strong>Amount Balance: </strong> {amountBalance.toFixed(2)} &nbsp; | &nbsp;
          <strong>Total Fee: </strong> {totalFee.toFixed(2)}
        </p>
      </div>

      {/* Bar Graph for Fee Data (conditionally rendered based on showGraph state) */}
      {showGraph && (
        <div style={{ width: "400px", height: "300px" }}>
          <h3>Fee Data Overview (Bar Graph)</h3>
          <Bar data={barData} options={barOptions} />
        </div>
      )}

      {/* Fee Data Table (conditionally rendered based on showTable state) */}
      {showTable && filteredFeeData.length > 0 && (
        <table className="fee-table">
          <thead>
            <tr>
              <th>Receipt No</th>
              <th>Name</th>
              <th>Class</th>
              <th>Date</th>
              <th>Description</th>
              <th>Payment Mode</th>
              <th>Amount Paid</th>
            </tr>
          </thead>
          <tbody>
            {filteredFeeData.map((row, index) => (
              <tr key={index}>
                <td>{row[0]}</td>
                <td>{row[1]}</td>
                <td>{row[2]}</td>
                <td>{row[3]}</td>
                <td>{row[4]}</td>
                <td>{row[5]}</td>
                <td>{row[6]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* If no fee records are found */}
      {showTable && filteredFeeData.length === 0 && (
        <p>No fee records found for this student in the specified classroom.</p>
      )}
    </div>
  );
};

export default FeeData;
