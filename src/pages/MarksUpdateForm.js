import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CSS/MarksUpdateForm.css'

const MarksUpdateForm = ({ classroom, students, closeForm }) => {
  const [marksData, setMarksData] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [subject, setSubject] = useState('');
  const [testType, setTestType] = useState('');
  const [totalMarks, setTotalMarks] = useState('');
  const [ranks, setRanks] = useState({});

  useEffect(() => {
    const initialData = {};
    students.forEach((student) => {
      initialData[student._id] = { obtainedMarks: '', note: '', selected: true }; // Set 'selected' to true by default
    });
    setMarksData(initialData);
  }, [students]);

  const handleMarksChange = (studentId, field, value) => {
    if (field === 'obtainedMarks' && parseFloat(value) > parseFloat(totalMarks)) {
      alert('Obtained marks cannot be greater than total marks.');
      return;
    }
    setMarksData((prev) => {
      const updatedData = {
        ...prev,
        [studentId]: {
          ...prev[studentId],
          [field]: value,
        },
      };

      // Automatically calculate ranks when obtained marks change
      if (field === 'obtainedMarks') {
        calculateRanks(updatedData);
      }

      return updatedData;
    });
  };

  const handleCheckboxChange = (studentId) => {
    setMarksData((prev) => {
      const updatedData = {
        ...prev,
        [studentId]: {
          ...prev[studentId],
          selected: !prev[studentId].selected,
        },
      };

      // Recalculate ranks after selecting or deselecting a student
      calculateRanks(updatedData);

      return updatedData;
    });
  };

  const calculateRanks = (updatedMarksData) => {
    const selectedStudents = students.filter((student) => updatedMarksData[student._id]?.selected);
    const sortedStudents = selectedStudents
      .filter((student) => updatedMarksData[student._id]?.obtainedMarks)
      .sort((a, b) => parseFloat(updatedMarksData[b._id]?.obtainedMarks) - parseFloat(updatedMarksData[a._id]?.obtainedMarks));

    const ranksMap = {};
    let rank = 1;

    for (let i = 0; i < sortedStudents.length; i++) {
      const currentMarks = parseFloat(updatedMarksData[sortedStudents[i]._id]?.obtainedMarks);

      if (i > 0 && currentMarks === parseFloat(updatedMarksData[sortedStudents[i - 1]._id]?.obtainedMarks)) {
        // Same rank for students with same marks
        ranksMap[sortedStudents[i]._id] = ranksMap[sortedStudents[i - 1]._id];
      } else {
        // Assign the current rank and increment it
        ranksMap[sortedStudents[i]._id] = rank;
        rank++;
      }
    }

    setRanks(ranksMap);
  };

  const submitMarks = async () => {
    if (!subject.trim()) {
      alert('Subject is required.');
      return;
    }
    if (!testType.trim()) {
      alert('Test Type is required.');
      return;
    }
    if (!totalMarks.trim() || isNaN(totalMarks)) {
      alert('Total Marks is required and must be a valid number.');
      return;
    }

    const invalidMarks = students.some((student) => {
      const obtainedMarks = parseFloat(marksData[student._id]?.obtainedMarks || 0);
      return obtainedMarks > parseFloat(totalMarks);
    });

    if (invalidMarks) {
      alert('One or more students have obtained marks greater than the total marks. Please fix this.');
      return;
    }

    const formattedData = students
      .filter((student) => marksData[student._id]?.selected)
      .map((student) => ({
        classroomName: classroom.name,
        classroomId: classroom._id,
        studentName: student.username,
        studentId: student._id,
        date: selectedDate,
        subject,
        testType,
        totalMarks,
        obtainedMarks: marksData[student._id]?.obtainedMarks || '',
        note: marksData[student._id]?.note || '',
        rank: ranks[student._id] || null,  // Include rank from frontend
      }));

    if (formattedData.length === 0) {
      alert('Please select at least one student.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/submit-marks', formattedData);
      alert('Marks submitted successfully');
      closeForm();
    } catch (err) {
      console.error('Failed to submit marks:', err);
      alert('Failed to submit marks');
    }
  };

  return (
    <div className="marks-container">
      <h3 className="marks-title">Update Marks for {classroom.name}</h3>
      <p className="marks-note"><strong>Note: </strong>Use the same <mark>Date & Subject</mark> to re-update the Existing Marks </p>
      <label className="test-date">
        Date:
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
           className="test-date input"
        />
      </label>

      <label className="test-label">
        Subject:
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
         className="input"
        />
      </label>

      <label className="test-label">
        Test Type:
        <input
          type="text"
          value={testType}
          onChange={(e) => setTestType(e.target.value)}
         className="input"
        />
      </label>

      <label className="test-label">
        Total Marks:
        <input
          type="number"
          value={totalMarks}
          onChange={(e) => setTotalMarks(e.target.value)}
         className="input"
        />
      </label>

      {students.map((student) => (
        <div key={student._id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <input
            type="checkbox"
            checked={marksData[student._id]?.selected || false}
            onChange={() => handleCheckboxChange(student._id)}
            className="custom-checkbox"
          />
          <p style={{ marginRight: '10px', minWidth: '100px' }}>{student.username}</p>

          <input
            type="number"
            placeholder="Obtained Marks"
            value={marksData[student._id]?.obtainedMarks || ''}
            onChange={(e) => handleMarksChange(student._id, 'obtainedMarks', e.target.value)}
            className="input-marks"
          />

          <input
            type="text"
            placeholder="Additional Note"
            value={marksData[student._id]?.note || ''}
            onChange={(e) => handleMarksChange(student._id, 'note', e.target.value)}
            className="input-note"
          />

          {marksData[student._id]?.selected && ranks[student._id] && (
            <p style={{ marginLeft: '20px', fontWeight: 'bold'}}>Rank: {ranks[student._id]}</p>
          )}
        </div>
      ))}

      <button
        onClick={submitMarks}
        className="submit"
      >
        Submit Marks
      </button>
    </div>
  );
};

export default MarksUpdateForm;
