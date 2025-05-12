import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactECharts from "echarts-for-react";
import { FaTrash } from 'react-icons/fa';
import './CSS/BlacklistData.css'

const BlacklistData = ({ classroomId, studentId }) => {
  const [blacklistData, setBlacklistData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showGauge, setShowGauge] = useState(false);
  const [showBlacklist, setShowBlacklist] = useState(false);
  const [gaugeValue, setGaugeValue] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");


  useEffect(() => {
    const fetchBlacklistData = async () => {
      try {
        let response;

        if (studentId) {
          response = await axios.get(
            `http://localhost:5000/api/blacklists/fetchBlacklistByStudent?classroomId=${classroomId}&studentId=${studentId}`
          );
        } else {
          response = await axios.get(
            `http://localhost:5000/api/blacklists/fetchBlacklistByClassroom?classroomId=${classroomId}`
          );
        }

        setBlacklistData(response.data);
        setFilteredData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching blacklist data:", err);
        setError("No Blacklist Record Found");
        setLoading(false);
      }
    };

    if (classroomId) fetchBlacklistData();
  }, [classroomId, studentId]);

  const handleStartDateChange = (event) => setStartDate(event.target.value);

  const handleEndDateChange = (event) => setEndDate(event.target.value);

  const handleFilter = () => {
    if (startDate && endDate) {
      const filtered = blacklistData.filter((item) => {
        const itemDate = new Date(item.date);
        const start = new Date(startDate);
        const end = new Date(endDate);

        return itemDate >= start && itemDate <= end;
      });
      setFilteredData(filtered);
    }
  };

  const handleClearFilter = () => {
    setStartDate("");
    setEndDate("");
    setFilteredData(blacklistData);
  };

  const handleToggleGauge = () => {
    setShowGauge((prev) => {
      if (!prev) setShowBlacklist(false);
      return !prev;
    });
  };

  const handleToggleBlacklist = () => {
    setShowBlacklist((prev) => {
      if (!prev) setShowGauge(false);
      return !prev;
    });
  };

 
  const handleDeleteRecord = async (classroomId, studentId, date) => {
    try {
      // Send the necessary data in the body of the DELETE request
      await axios.delete(
        `http://localhost:5000/api/blacklists/deleteStudentData`,
        {
          data: { classroomId, studentId, date }, // Include data here
        }
      );
  
      // Update state to remove the deleted record
      setFilteredData((prev) =>
        prev.filter((item) => !(item.classroomId === classroomId && item.studentId === studentId && item.date === date))
      );
      setBlacklistData((prev) =>
        prev.filter((item) => !(item.classroomId === classroomId && item.studentId === studentId && item.date === date))
      );
      // Set success message and clear after 3 seconds
    setSuccessMessage("Blacklist data deleted successfully!");
    setTimeout(() => {
      setSuccessMessage("");  // Clear the message after 3 seconds
    }, 3000); // 3000 milliseconds = 3 seconds
    } catch (err) {
      console.error("Error deleting record:", err);
    }
  };
  

   // Increase the count of the gauge gradually
   useEffect(() => {
    if (showGauge) {
      const totalRecords = filteredData.length;
      let currentValue = 0;

      // Animation logic
      const updateGauge = () => {
        if (currentValue < totalRecords) {
          currentValue += 1;
          setGaugeValue(currentValue);
        } else {
          clearInterval(interval); // Stop the interval when max value is reached
        }
      };

      const interval = setInterval(updateGauge, 250); // Increase the value every 100ms
      return () => clearInterval(interval); // Cleanup on component unmount
    } else {
      setGaugeValue(0); // Reset the gauge value when hidden
    }
  }, [showGauge, filteredData.length]);

  // Function to determine color based on severity
  // Function to determine color based on severity
const getGaugeColor = (value) => {
  if (value < filteredData.length / 3) {
    return "#00FF00"; // Green for low severity
  } else if (value < (filteredData.length * 2) / 3) {
    return "#FFD700"; // Yellow for moderate severity
  } else {
    return "#FF0000"; // Red for high severity
  }
};

  // Gauge Chart Options
const gaugeOptions = {
  title: {
    text: "Blacklist Count",
    left: "center",
  },
  tooltip: {
    formatter: "{a} <br/>{b} : {c}",
  },
  series: [
    {
      name: "Blacklist Count",
      type: "gauge",
      detail: {
        formatter: "{value}",
        fontSize: 20,
        color: getGaugeColor(gaugeValue), // Set dynamic color for the number count
      },
      data: [{ value: gaugeValue, name: "Count" }],
      max: filteredData.length > 0 ? filteredData.length : 10, // Dynamic max value
      animationDuration: 2000, // Slows down the initial needle animation
      animationEasing: "cubicOut", // Easing effect for smooth animation
      animationDurationUpdate: 2000, // Adjusts the speed of updates
      pointer: {
        width: 5, // Thickness of the needle
        length: "70%", // Length of the needle
        itemStyle: {
          color: getGaugeColor(gaugeValue), // Dynamic color for the gauge needle
        },
      },
      axisLine: {
        lineStyle: {
          color: [
            [0.33, "#00FF00"], // Green for low severity
            [0.66, "#FFD700"], // Yellow for moderate severity
            [1, "#FF0000"], // Red for high severity
          ],
          width: 8,
        },
      },
      axisLabel: {
        color: getGaugeColor(gaugeValue), // Apply dynamic color to the axis labels
      },
      axisTick: {
        lineStyle: {
          color: getGaugeColor(gaugeValue), // Apply dynamic color to axis ticks
        },
      },
      splitLine: {
        lineStyle: {
          color: getGaugeColor(gaugeValue), // Apply dynamic color to split lines
        },
      },
    },
  ],
};


  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div >
      <h3>Blacklist Data</h3>

     {/* Success Message */}
    {successMessage && (
      <div style={{ color: "green", marginBottom: "20px" }}>
        {successMessage}
      </div>
    )}



      <div className="filter-container">
        <label htmlFor="startDate" className="filter-label">
          Start Date:
        </label>
        <input
          type="date"
          id="startDate"
          value={startDate}
          onChange={handleStartDateChange}
          className="filter-input"
        />

        <label htmlFor="endDate" className="filter-label">
          End Date:
        </label>
        <input
          type="date"
          id="endDate"
          value={endDate}
          onChange={handleEndDateChange}
          className="filter-input"
        />

        <button onClick={handleFilter} className="filter-button">
          Filter
        </button>
        <button onClick={handleClearFilter} className="filter-button">
          Clear Filter
        </button>

        <button onClick={handleToggleGauge} className="filter-button">
          {showGauge ? "Hide Gauge" : "Show Gauge"}
        </button>

        <button onClick={handleToggleBlacklist} className="filter-button">
          {showBlacklist ? "Hide Blacklist Data" : "Show Blacklist Data"}
        </button>
         {/* Displaying No Blacklist Data message if there is no data */}
          {showBlacklist && filteredData.length === 0 && (
         <p>No Blacklist Data</p>
          )}
      </div>

      <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start" }}>
        {showGauge && (
          <ReactECharts option={gaugeOptions} style={{ height: "400px", width: "300px", marginRight: "20px" }} />
        )}

        {showBlacklist && filteredData.length > 0 && (
          <div style={{ flex: 1 }}>
            <p>Total Blacklist Count: {filteredData.length}</p>
            <table className="blacklist-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Reason</th>
                  <th>Additional Note</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.date}</td>
                    <td>{item.reason}</td>
                    <td>{item.additionalNote}</td>
                    <td>
                      <button
                      
                        onClick={() =>
                        handleDeleteRecord(item.classroomId, item.studentId, item.date)}
                        style={{
                          color: 'red',
                          fontSize: '20px',
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
          </div>
        )}
      </div>
    </div>
  );
};

export default BlacklistData;
