import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { FaTrash } from 'react-icons/fa';
import './CSS/ExpenseData.css'

const ExpenseData = () => {
  const [expenseData, setExpenseData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [showGraph, setShowGraph] = useState(false);
  const [showData, setShowData] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchExpenseData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/expenses/fetchExpenseData');
        setExpenseData(response.data);
        setFilteredData(response.data);
        setTotalAmount(
          response.data.reduce((acc, expense) => acc + parseFloat(expense[6] || 0), 0)
        );
        setLoading(false);
      } catch (err) {
        console.error('Error fetching expense data:', err);
        setError(err);
        setLoading(false);
      }
    };

    fetchExpenseData();
  }, []);

  const filterDataByDate = () => {
    const filtered = expenseData.filter((expense) => {
      const expenseDate = new Date(expense[1]);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return expenseDate >= start && expenseDate <= end;
    });

    setFilteredData(filtered);
    const total = filtered.reduce((acc, expense) => acc + parseFloat(expense[6] || 0), 0);
    setTotalAmount(total);
  };

  const clearFilter = () => {
    setStartDate('');
    setEndDate('');
    setFilteredData(expenseData);
    setTotalAmount(
      expenseData.reduce((acc, expense) => acc + parseFloat(expense[6] || 0), 0)
    );
  };

  const toggleGraph = () => {
    setShowGraph(!showGraph);
    if (!showGraph) setShowData(false); // Turn off data when graph is activated
  };

  const toggleData = () => {
    setShowData(!showData);
    if (!showData) setShowGraph(false); // Turn off graph when data is activated
  };

  const handleDeleteExpense = async (invoiceNo, date, paymentMethod, payedTo, category) => {
    // Optimistically update the UI by immediately removing the expense
    setFilteredData((prevData) =>
      prevData.filter(
        (expense) =>
          !(expense[0] === invoiceNo && expense[1] === date && expense[2] === paymentMethod && expense[3] === payedTo && expense[4] === category)
      )
    );

    try {
      const response = await axios.delete('http://localhost:5000/api/expenses/deleteExpense', {
        data: {
          invoiceNo,
          date,
          paymentMethod,
          payedTo,
          category,
        },
      });
      console.log(response.data.message);

      // Optionally, you can show a success message
      setSuccessMessage("Expense data deleted successfully!");
      setTimeout(() => {
        setSuccessMessage("");  // Clear the message after 3 seconds
      }, 3000); // 3000 milliseconds = 3 seconds
    } catch (err) {
      console.error("Error deleting record:", err);

      // Revert UI changes if the request fails
      setFilteredData((prevData) => [
        ...prevData,
        [invoiceNo, date, paymentMethod, payedTo, category],
      ]);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>No expense records found</p>;

  // Prepare data for the graph
  const graphData = {
    labels: filteredData.map((expense) => expense[1]), // Assuming the second column is the date
    datasets: [
      {
        label: 'Amount',
        data: filteredData.map((expense) => parseFloat(expense[6] || 0)),
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        tension: 0.3,
      },
    ],
  };

  return (
    <div style={{ marginTop: '30px' }}>
      <h2 style={{ marginBottom: '20px', fontFamily: 'Arial, sans-serif', marginLeft: '30px' }}>
        Expense Data
      </h2>

      {/* Success Message */}
      {successMessage && (
        <div style={{ color: "green", marginBottom: "20px" }}>
          {successMessage}
        </div>
      )}

      <div className="expensedata-container">
        <label className="expensedata-label">Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
           className="expensedata-input start-date"
        />
        <label className="expensedata-label">End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="expensedata-input start-date"
        />
        <button onClick={filterDataByDate} className="expensedata-button">
          Filter
        </button>
        <button onClick={clearFilter} className="expensedata-button">
          Clear Filter
        </button>
        <button onClick={toggleGraph} className="expensedata-button">
          {showGraph ? 'Hide Graph' : 'Show Graph'}
        </button>
        <button onClick={toggleData} className="expensedata-button">
          {showData ? 'Hide Data' : 'Show Data'}
        </button>
      </div>

      <h3 style={{ marginLeft: '30px' }}>Total Amount: {totalAmount.toFixed(2)}</h3>

      {showGraph && (
        <div
          style={{
            width: '60%',
            height: '300px', // Reduced height
            marginLeft: '30px',
            marginBottom: '30px',
          }}
        >
          <Line
            data={graphData}
            options={{
              maintainAspectRatio: false, // Allows custom height
            }}
          />
        </div>
      )}

      {showData && (
        <table
          className="expensedata-table"
        >
          <thead>
            <tr>
              <th>Invoice No</th>
              <th>Date</th>
              <th>Payment Method</th>
              <th>Payed To</th>
              <th>Category</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Additional Note</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, index) => (
              <tr key={index}>
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    style={{
                      padding: '10px',
                      textAlign: 'center',
                    }}
                  >
                    {cell}
                  </td>
                ))}
                <td>
                  <button
                    onClick={() =>
                      handleDeleteExpense(
                        row[0], // invoiceNo
                        row[1], // date
                        row[2], // paymentMethod
                        row[3], // payedTo
                        row[4]  // category
                      )
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
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ExpenseData;
