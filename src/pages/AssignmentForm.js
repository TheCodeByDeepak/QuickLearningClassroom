import React, { useState, useEffect } from "react";
import axios from "axios";
import './CSS/AssignmentForm.css'

const AssignmentForm = ({ classroom, students, closeForm }) => {
  const [homeworkData, setHomeworkData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [originalData, setOriginalData] = useState([]); // Stores the original fetched data
  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [descriptionFilter, setDescriptionFilter] = useState("");
  const [showHomework, setShowHomework] = useState(false);
  const [disableAssignButton, setDisableAssignButton] = useState(false);

  // Tracks fetched student IDs to prevent duplicate fetching
  const [fetchedStudentIds, setFetchedStudentIds] = useState(new Set());

  const todayDate = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

  const isDateMismatch = !filteredData.some(
    (record) => record.startDate === todayDate || record.endDate === todayDate
  );

  useEffect(() => {
    const initialData = {};
    students.forEach((student) => {
      initialData[student._id] = { selected: true }; // Initially, all students are selected
    });
    setHomeworkData(initialData);
  }, [students]);

  const handleCheckboxChange = (studentId) => {
    setHomeworkData((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        selected: !prev[studentId]?.selected,
      },
    }));
  };

  const submitAssignment = async () => {
    const description = "Submitted";

    const selectedStudents = students.filter(
      (student) => homeworkData[student._id]?.selected
    );

    if (selectedStudents.length === 0) {
      alert("Please select at least one student.");
      return;
    }

    if (!startDate || !endDate) {
      alert("Please select both start date and end date.");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      alert("Start date cannot be after end date.");
      return;
    }

    const formattedData = selectedStudents.map((student) => ({
      classroomName: classroom.name,
      classroomId: classroom._id,
      studentName: student.username,
      studentId: student._id,
      description,
      startDate,
      endDate,
    }));

    try {
      await axios.post(
        "http://localhost:5000/api/assignment/submit-assignment",
        formattedData
      );
      alert("Assignment assigned successfully");
      closeForm();
    } catch (err) {
      console.error("Failed to assign assignment:", err);
      alert("Failed to assign assignment");
    }
  };

  const fetchHomeworkData = async (classroomId, studentId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/homework/fetchHomeworkByStudent?classroomId=${classroomId}&studentId=${studentId}`
      );
  
      const transformedData = response.data.map((record) => ({
        classroomName: record.classroomName || "N/A",
        studentName: record.studentName || "N/A",
        startDate: record.startDate || "N/A",
        startTime: record.startTime || "N/A",
        endDate: record.endDate || "N/A",
        endTime: record.endTime || "N/A",
        description: record.description || "N/A",
        remark: record.remark || "N/A",
        status: record.status || "Not Submitted",
        homeworkId: record._id,
      }));
  
      setOriginalData((prev) => {
        const uniqueData = [
          ...prev,
          ...transformedData.filter(
            (newRecord) =>
              !prev.some((existingRecord) => existingRecord.homeworkId === newRecord.homeworkId)
          ),
        ];
        return uniqueData;
      });
  
      setFilteredData((prev) => {
        const uniqueData = [
          ...prev,
          ...transformedData.filter(
            (newRecord) =>
              !prev.some((existingRecord) => existingRecord.homeworkId === newRecord.homeworkId)
          ),
        ];
        return uniqueData;
      });
  
      const hasNotSubmitted = transformedData.some(
        (record) => record.status === "Not Submitted"
      );
  
      setDisableAssignButton(!hasNotSubmitted);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching homework data:", err);
      setError(err);
      setLoading(false);
    }
  };
  

  const handleFilter = () => {
    const filtered = originalData.filter((record) => {
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

    const hasNotSubmitted = filtered.some(
      (record) => record.status === "Not Submitted"
    );
    setDisableAssignButton(!hasNotSubmitted);
  };

  const handleClearFilter = () => {
    setStartDate("");
    setEndDate("");
    setDescriptionFilter("");
    setFilteredData(originalData);

    const hasNotSubmitted = originalData.some(
      (record) => record.status === "Not Submitted"
    );
    setDisableAssignButton(!hasNotSubmitted);
  };

  const handleShowHomework = () => {
    setShowHomework(!showHomework);
  };

  useEffect(() => {
    if (classroom && classroom._id) {
      students.forEach((student) => {
        if (!fetchedStudentIds.has(student._id)) {
          fetchHomeworkData(classroom._id, student._id);
          setFetchedStudentIds((prev) => new Set(prev).add(student._id));
        }
      });
    }
  }, [classroom, students, fetchedStudentIds]);

  return (
    <div>
      <h3 style={{ marginTop: "20px" }}>Assign Assignment for {classroom.name}</h3>

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
  <button onClick={handleShowHomework} className="filter-button">
    {showHomework ? "Hide Homework" : "Show Homework"}
  </button>
</div>


      {/* Homework Data */}
      {showHomework && (
        <div>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>No homework data found for this classroom or student.</p>
          ) : filteredData.length === 0 ? (
            <p>No records found based on the applied filters</p>
          ) : (
            <table className="assignment-table">
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
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      <h3 style={{ marginTop: "20px" }}>Select Student:</h3>
      {students.map((student) => (
        <div
          key={student._id}
          style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}
        >
          <input
            type="checkbox"
            checked={homeworkData[student._id]?.selected || false}
            onChange={() => handleCheckboxChange(student._id)}
            style={{ marginRight: "10px" }}
            className="custom-checkbox"
            
          />
          <p style={{ marginRight: "10px", minWidth: "100px" }}>{student.username}</p>
        </div>
      ))}

<button
  onClick={submitAssignment}
  disabled={disableAssignButton || isDateMismatch} // Disable if either condition is true
  style={{
    marginBottom: "50px",
    marginLeft: "0px",
    marginTop: "20px",
    backgroundColor: disableAssignButton || isDateMismatch ? "gray" : "",
    cursor: disableAssignButton || isDateMismatch ? "not-allowed" : "",
  }}
  className="filter-button"
>
  Update Status
</button>
    </div>
  );
};

export default AssignmentForm;
