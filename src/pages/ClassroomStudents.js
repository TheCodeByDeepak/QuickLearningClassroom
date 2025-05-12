import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AttendanceData from './AttendanceData';
import FeeForm from './FeeForm';
import FeeData from './FeeData';
import BlacklistForm from './BlacklistForm';
import BlacklistData from './BlacklistData';
import TestMarksData from './TestMarksData';
import HomeworkData from './HomeworkData';
import Emails from './Emails';
import './CSS/ExistingClassrooms.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGraduate} from '@fortawesome/free-solid-svg-icons';
import './CSS/ExistingClassrooms.css'

const ClassroomStudents = ({ classroomId }) => {
  const [students, setStudents] = useState([]);
  const [attendanceVisibility, setAttendanceVisibility] = useState({});
  const [visibleError, setVisibleError] = useState('');
  const [feeFormVisibility, setFeeFormVisibility] = useState({});
  const [studentsVisible, setStudentsVisible] = useState(false); // New state for toggling student list visibility
  const [feeVisibility, setFeeVisibility] = useState({});
  const [blacklistFormVisibility, setBlacklistFormVisibility] = useState({});
  const [blacklistVisibility, setBlacklistVisibility] = useState({});
  const [testmarksVisibility, setTestMarksVisibility] = useState({});
  const [visiblehw, setVisiblehw] = useState({});
  const [emailVisibility, setemailVisibility] = useState({});
  const [studentDetailsVisibility, setStudentDetailsVisibility] = useState({});

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/classrooms/${classroomId}/students`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStudents(response.data);
        // Initialize attendance visibility to false for each student
        setAttendanceVisibility(
          response.data.reduce((acc, student) => {
            acc[student._id] = false;
            return acc;
          }, {})
        );

        setFeeVisibility(
          response.data.reduce((acc, student) => {
            acc[student._id] = false;
            return acc;
          }, {})
        );

        setBlacklistFormVisibility(response.data.reduce((acc, student) => {
          acc[student._id] = false;
          return acc;
        }, {}));

        setFeeFormVisibility(
          response.data.reduce((acc, student) => {
            acc[student._id] = false;
            return acc;
          }, {})
        );
      } catch (err) {
        setVisibleError(err.response?.data?.message || 'Failed to fetch students');
      }
    };

    fetchStudents();
  }, [classroomId]);

  const toggleAttendanceVisibility = (studentId) => {
    setAttendanceVisibility((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  const toggleStudentsVisibility = () => {
    setStudentsVisible((prev) => !prev);
  };

  const toggleFeeVisibility = (studentId) => {
    setFeeVisibility((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  const toggleFeeFormVisibility = (studentId) => {
    setFeeFormVisibility((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  const toggleBlacklistFormVisibility = (studentId) => {
    setBlacklistFormVisibility((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  const toggleBlacklistVisibility = (studentId) => {
    setBlacklistVisibility((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  const toggletestmarksVisibility = (studentId) => {
    setTestMarksVisibility((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  const togglehw = (studentId) => {
    setVisiblehw((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  const toggleemailVisibility = (studentId) => {
    setemailVisibility((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  const toggleStudentDetails = (studentId) => {
    setStudentDetailsVisibility((prevState) => ({
      ...prevState,
      [studentId]: !prevState[studentId],
    }));
  };


  
  return (
    <div>
      {visibleError && <p style={{ color: 'red' }}>{visibleError}</p>}
      <div style={{ marginTop: '5px' }}>
      <div className="card" onClick={toggleStudentsVisibility}>
  <div className="card-content">
    <FontAwesomeIcon icon={faUserGraduate} className="icon-admin" />
    <h3 className={`hide-text ${studentsVisible ? 'hidden' : ''}`}>
      {studentsVisible ? 'Hide Quick Info' : 'Quick Info'}
    </h3>
  </div>
</div>

      </div> 
      {studentsVisible && (
        <ul type="square">

          {students.length === 0 ? (
            <p>No students in this classroom.</p>
          ) : (
            students.map((student) => (
              <li key={student._id}  style={{ marginTop: '10px', fontSize:'20px'}}>
                
                {student.username}

                <button
    onClick={() => toggleStudentDetails(student._id)}
    className="view-details-btn-quick-admin"
  >
    {studentDetailsVisibility[student._id] ? 'Hide Details' : 'View Details'}
  </button>
                             {/* Existing Buttons - Shown/Hidden Based on Visibility */}
  {studentDetailsVisibility[student._id] && (
    <>



  <button
  onClick={() => toggleAttendanceVisibility(student._id)}
  className={`action-btn-admin quick-btn-admin ${attendanceVisibility[student._id] ? 'hide-btn-admin' : ''}`}
>
  {attendanceVisibility[student._id] ? 'Hide Attendance' : 'Attendance'}
</button>

               
<button
  onClick={() => toggleFeeFormVisibility(student._id)}
  className={`action-btn-admin quick-btn-admin ${feeFormVisibility[student._id] ? 'hide-btn-admin' : ''}`}
>
  {feeFormVisibility[student._id] ? 'Hide Fee' : 'Update Fee'}
</button>

<button
  onClick={() => toggleFeeVisibility(student._id)}
  className={`action-btn-admin quick-btn-admin ${feeVisibility[student._id] ? 'hide-btn-admin' : ''}`}
>
  {feeVisibility[student._id] ? 'Hide Fee Info' : 'Fee Info'}
</button>

<button
  onClick={() => toggleBlacklistFormVisibility(student._id)}
  className={`action-btn-admin quick-btn-admin ${blacklistFormVisibility[student._id] ? 'hide-btn-admin' : ''}`}
>
  {blacklistFormVisibility[student._id] ? 'Hide Blacklist' : 'Update Blacklist'}
</button>

               

<button
  onClick={() => toggleBlacklistVisibility(student._id)}
  className={`action-btn-admin quick-btn-admin ${blacklistVisibility[student._id] ? 'hide-btn-admin' : ''}`}
>
  {blacklistVisibility[student._id] ? 'Hide Blacklist Info' : 'Blacklist Info'}
</button>

<button
  onClick={() => toggletestmarksVisibility(student._id)}
  className={`action-btn-admin quick-btn-admin ${testmarksVisibility[student._id] ? 'hide-btn-admin' : ''}`}
>
  {testmarksVisibility[student._id] ? 'Hide Marks Info' : 'Marks Info'}
</button>
               
<button
  onClick={() => togglehw(student._id)}
  className={`action-btn-admin quick-btn-admin ${visiblehw[student._id] ? 'hide-btn-admin' : ''}`}
>
  {visiblehw[student._id] ? 'Hide Hw' : 'Show Hw'}
</button>

<button
  onClick={() => toggleemailVisibility(student._id)}
  className={`action-btn-admin quick-btn-admin ${emailVisibility[student._id] ? 'hide-btn-admin' : ''}`}
>
  {emailVisibility[student._id] ? 'Hide Notification' : 'Send Notification'}
</button>

                 </>
                 )}




                {attendanceVisibility[student._id] && (
                  <AttendanceData classroomId={classroomId} studentId={student._id} />
                )}

                {feeFormVisibility[student._id] && (
                  <FeeForm
                    classroomId={classroomId} // Passed the classroomId to FeeForm
                    student={student} // Pass the student info
                    closeForm={() => toggleFeeFormVisibility(student._id)}
                  />
                )}

                {feeVisibility[student._id] && (
                  <FeeData
                    classroomId={classroomId} // Passed the classroomId to FeeData
                    studentId={student._id} // Pass the student ID
                  />
                )}

                {blacklistFormVisibility[student._id] && (
                  <BlacklistForm
                    classroomId={classroomId}
                    student={student}
                    closeForm={() => toggleBlacklistFormVisibility(student._id)}
                  />
                )}

                {blacklistVisibility[student._id] && (
                 <BlacklistData classroomId={classroomId} studentId={student._id} />
                )}


                {testmarksVisibility[student._id] && (
                 <TestMarksData classroomId={classroomId} studentId={student._id} />
                )}

                {visiblehw[student._id] && (
                  <HomeworkData classroomId={classroomId} studentId={student._id} />
                )}

                {emailVisibility[student._id] && (
                  <Emails classroomId={classroomId} studentId={student._id} />
                )}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default ClassroomStudents;
