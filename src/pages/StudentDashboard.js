import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AttendanceData from './Student/AttendanceDataStudent';
import FeeData from './Student/FeeDataStudent';
import BlacklistData from './Student/BlacklistDataStudent';
import TestMarksData from './Student/TestMarksDataStudent';
import VideoDetails from './Student/VideoDetailsStudent';
import ScheduleDetails from './Student/ScheduleDetailsStudent';
import StudyMaterialViewer from './Student/StudyMaterialViewerStudent';
import HomeworkData from './hwupload';
import AssignmentForm from './AssignmentForm';
import FormDetails from './Student/FormDetailsStudent';
import GoogleMeetLinksStudent from './Student/GoogleMeetLinksStudent';
import HomeworkViewer from './HomeworkViewer';
import Chat from './Chat'; 
import ViewUser from '../components/ViewUsers';
import './CSS/StudentDashboard.css'
import { FaUser } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarCheck, faWallet, faBan, faChartLine, faPlayCircle,faVideo, faCalendarAlt, faBook, faCloudUploadAlt, faClipboard, faSearch, faFileAlt, faComments } from '@fortawesome/free-solid-svg-icons';


const StudentDashboard = () => {
  const [joinCode, setJoinCode] = useState('');
  const [message, setMessage] = useState('');
  const [classrooms, setClassrooms] = useState([]);
  const [studentDetails, setStudentDetails] = useState({});
  const [visibleStudents, setVisibleStudents] = useState({});
  const [attendanceVisibility, setAttendanceVisibility] = useState({});
  const [feeVisibility, setFeeVisibility] = useState({});
  const studentId = localStorage.getItem('studentId');
  const [blacklistVisibility, setBlacklistVisibility] = useState({});
  const [testmarksVisibility, setTestMarksVisibility] = useState({});
  const [visibleVideo, setVisibleVideo] = useState({});
  const [visibleSchedule, setVisibleSchedule] = useState({});
  const [visibleStudyMaterial, setVisibleStudyMaterial] = useState({});
  const [visiblehw, setVisiblehw] = useState({});
  const [hwassigFormVisibility, sethwassigFormVisibility] = useState({});
  const [visibleForm, setVisibleForm] = useState({});
  const [visiblemeetlink, setVisiblemeetlink] = useState({});
  const [visiblehwview, setVisiblehwview] = useState({});
  const [chatVisibility, setChatVisibility] = useState({});
  const [userVisibility, setuserVisibility] = useState({});

  const handleJoinClassroom = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/classrooms/join-request',
        { code: joinCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(response.data.message);
      setJoinCode('');

      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to request joining classroom');
      setTimeout(() => {
        setMessage('');
      }, 3000);
    }
  };

  const fetchClassrooms = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/students/classrooms`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClassrooms(response.data);
    } catch (err) {
      console.error('Failed to fetch classrooms', err);
    }
  };

  const toggleStudentDetails = async (classroomId) => {
    if (visibleStudents[classroomId]) {
      setVisibleStudents((prev) => ({ ...prev, [classroomId]: false }));
    } else {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/classrooms/${classroomId}/students`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const currentStudent = response.data.find(
          student => String(student._id) === String(studentId)
        );

        setStudentDetails((prev) => ({
          ...prev,
          [classroomId]: currentStudent ? [currentStudent] : [],
        }));
        setVisibleStudents((prev) => ({ ...prev, [classroomId]: true }));
      } catch (err) {
        console.error('Failed to fetch student details', err);
      }
    }
  };

  const toggleAttendance = (classroomId, studentId) => {
    setAttendanceVisibility((prev) => ({
      ...prev,
      [classroomId]: {
        ...prev[classroomId],
        [studentId]: !prev[classroomId]?.[studentId]
      }
    }));
  };

  const toggleFeeVisibility = (classroomId, studentId) => {
    setFeeVisibility((prev) => ({
      ...prev,
      [classroomId]: {
        ...prev[classroomId],
        [studentId]: !prev[classroomId]?.[studentId]
      }
    }));
  };

  const toggleBlacklistVisibility = (classroomId, studentId) => {
    setBlacklistVisibility((prev) => ({
      ...prev,
      [classroomId]: {
        ...prev[classroomId],
        [studentId]: !prev[classroomId]?.[studentId]
      }
    }));
  };

  const toggletestmarksVisibility = (classroomId, studentId) => {
    setTestMarksVisibility((prev) => ({
      ...prev,
      [classroomId]: {
        ...prev[classroomId],
        [studentId]: !prev[classroomId]?.[studentId]
      }
    }));
  };

  const togglevideo = (classroomId) => {
    setVisibleVideo((prev) => ({
      ...prev,
      [classroomId]: !prev[classroomId],
    }));
  };

  const toggleschedule = (classroomId) => {
    setVisibleSchedule((prev) => ({
      ...prev,
      [classroomId]: !prev[classroomId],
    }));
  };

  const togglestudymaterial = (classroomId) => {
    setVisibleStudyMaterial((prev) => ({
      ...prev,
      [classroomId]: !prev[classroomId],
    }));
  };


  const togglehw = (classroomId, studentId) => {
    setVisiblehw((prev) => ({
      ...prev,
      [classroomId]: {
        ...prev[classroomId],
        [studentId]: !prev[classroomId]?.[studentId]
      }
    }));
  };

  const togglehwassigForm = (classroom) => {
    sethwassigFormVisibility((prevState) => ({
      ...prevState,
      [classroom._id]: !prevState[classroom._id], // Toggle visibility for this classroom
    }));
  };

  const toggleform = (classroomId) => {
    setVisibleForm((prev) => ({
      ...prev,
      [classroomId]: !prev[classroomId],
    }));
  };

  const togglemeetlink = (classroomId) => {
    setVisiblemeetlink((prev) => ({
      ...prev,
      [classroomId]: !prev[classroomId],
    }));
  };

  const togglehwview = (classroomId, studentId) => {
    setVisiblehwview((prev) => ({
      ...prev,
      [classroomId]: {
        ...prev[classroomId],
        [studentId]: !prev[classroomId]?.[studentId]
      }
    }));
  };

  // Toggle the chat visibility
  const toggleChatVisibility = (classroomId) => {
    setChatVisibility((prev) => ({
      ...prev,
      [classroomId]: !prev[classroomId], // Toggle visibility for the specific classroom
    }));
  };

  const toggleuserVisibility = (studentId) => {
    setuserVisibility((prev) => ({
      ...prev,
      [studentId]: !prev[studentId], // Toggle visibility based on studentId
    }));
  };
  


   useEffect(() => {
    fetchClassrooms();
  }, []);

  

  return (
    <div className="student-page">
      <h2 class="dashboard-heading">Student Dashboard</h2>


      {message && <p>{message}</p>}

      <form onSubmit={handleJoinClassroom}>
      <label className="join-code-label">Enter Join Code: </label><br />
      <input
        type="text"
        placeholder="Join Code"
        value={joinCode}
        onChange={(e) => setJoinCode(e.target.value)}
        required
        className="join-code-input"  // Add the class name here
      />
      <button type="submit" className="join-code-button" style={{ marginLeft: '5px' }}>
        Request to Join Classroom
      </button>
      </form>
      <div
        onClick={() => toggleuserVisibility(studentId)} // Pass studentId here
        style={{
          position: 'absolute',
          top: '43px',
          right: '10px',
          padding: '10px',
          backgroundColor: '##2a5298',
          color: 'white',
          border: '1px',
          borderRadius: '50%',
          cursor: 'pointer',
          fontSize: '24px', // You can adjust the size of the icon
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Font Awesome User Icon */}
        <FaUser />
      </div>


{studentId && userVisibility[studentId] && (
  <ViewUser studentId={studentId} />
)}

<h3 className="classroom-heading">Your Classrooms</h3>
      {classrooms.length === 0 ? (
        <p className="no-classrooms-message">No classrooms available</p>

      ) : (
        <ul className="classroom-list">
  {classrooms.map((classroom) => (
    <li key={classroom._id} className="classroom-item">
      <h4>Class: {classroom.name}</h4>
      <p><strong>Subject:</strong> {classroom.subject}</p>
      <p><strong>Timing:</strong> {classroom.startTiming} to {classroom.endTiming}</p>
           
              <button
  onClick={() => toggleStudentDetails(classroom._id)}
  className="toggle-details-btn" /* Add the class name */
  style={{ marginTop: '7px' }}
>
  {visibleStudents[classroom._id] ? 'Hide Your Details' : 'Your Details'}
</button>

              {visibleStudents[classroom._id] && studentDetails[classroom._id] && (
                <div >
                  <h3>More Details</h3>
                 
                    {studentDetails[classroom._id].length === 0 ? (
                      <p>No students enrolled</p>
                    ) : (
                      studentDetails[classroom._id].map((student) => (
                        <li key={student._id}>
                          


                          <div className="card-container">
                          <div className="card" onClick={() => toggleAttendance(classroom._id, student._id)}>
  <div className="card-content">
    <FontAwesomeIcon icon={faCalendarCheck} className="icon" />
    <h3 className={`attendance-text ${attendanceVisibility[classroom._id]?.[student._id] ? 'hidden' : ''}`}>
      {attendanceVisibility[classroom._id]?.[student._id] ? 'Hide Attendance' : 'Attendance'}
    </h3>
  </div>
</div>

<div className="card" onClick={() => toggleFeeVisibility(classroom._id, student._id)}>
  <div className="card-content">
    <FontAwesomeIcon icon={faWallet} className="icon" />
    <h3 className={`fee-text ${feeVisibility[classroom._id]?.[student._id] ? 'hidden' : ''}`}>
      {feeVisibility[classroom._id]?.[student._id] ? 'Hide Fee Info' : 'Fee Info'}
    </h3>
  </div>
</div>

<div className="card" onClick={() => toggleBlacklistVisibility(classroom._id, student._id)}>
  <div className="card-content">
    <FontAwesomeIcon icon={faBan} className="icon" />
    <h3 className={`blacklist-text ${blacklistVisibility[classroom._id]?.[student._id] ? 'hidden' : ''}`}>
      {blacklistVisibility[classroom._id]?.[student._id] ? 'Hide Blacklist Info' : 'Blacklist Info'}
    </h3>
  </div>
</div>

<div className="card" onClick={() => toggletestmarksVisibility(classroom._id, student._id)}>
  <div className="card-content">
    <FontAwesomeIcon icon={faChartLine} className="icon" />
    <h3 className={`marks-text ${testmarksVisibility[classroom._id]?.[student._id] ? 'hidden' : ''}`}>
      {testmarksVisibility[classroom._id]?.[student._id] ? 'Hide Marks Info' : 'Marks Info'}
    </h3>
  </div>
</div>

<div className="card" onClick={() => togglevideo(classroom._id)}>
  <div className="card-content">
    <FontAwesomeIcon icon={faPlayCircle} className="icon" />
    <h3 className={`video-text ${visibleVideo[classroom._id] ? 'hidden' : ''}`}>
      {visibleVideo[classroom._id] ? 'Hide Videos' : 'Videos'}
    </h3>
  </div>
</div>

<div className="card" onClick={() => toggleschedule(classroom._id)}>
  <div className="card-content">
    <FontAwesomeIcon icon={faCalendarAlt} className="icon" />
    <h3 className={`schedule-text ${visibleSchedule[classroom._id] ? 'hidden' : ''}`}>
      {visibleSchedule[classroom._id] ? 'Hide Schedule' : 'Schedule'}
    </h3>
  </div>
</div>

<div className="card" onClick={() => togglestudymaterial(classroom._id)}>
  <div className="card-content">
    <FontAwesomeIcon icon={faBook} className="icon" />
    <h3 className={`notes-text ${visibleStudyMaterial[classroom._id] ? 'hidden' : ''}`}>
      {visibleStudyMaterial[classroom._id] ? 'Hide Notes' : 'Notes'}
    </h3>
  </div>
</div>

<div className="card" onClick={() => togglehw(classroom._id, student._id)}>
  <div className="card-content">
    <FontAwesomeIcon icon={faCloudUploadAlt} className="icon" />
    <h3 className={`hw-text ${visiblehw[classroom._id]?.[student._id] ? 'hidden' : ''}`}>
      {visiblehw[classroom._id]?.[student._id] ? 'Hide Hw' : 'Upload Hw'}
    </h3>
  </div>
</div>

<div className="card" onClick={() => togglehwassigForm(classroom)}>
  <div className="card-content">
    <FontAwesomeIcon icon={faClipboard} className="icon" />
    <h3 className={`hw-status-text ${hwassigFormVisibility[classroom._id] ? 'hidden' : ''}`}>
      {hwassigFormVisibility[classroom._id] ? 'Hide Hw Status' : 'Update Hw Status'}
    </h3>
  </div>
</div>

<div className="card" onClick={() => togglehwview(classroom._id, student._id)}>
  <div className="card-content">
    <FontAwesomeIcon icon={faSearch} className="icon" />
    <h3 className={`hw-view-text ${visiblehwview[classroom._id]?.[student._id] ? 'hidden' : ''}`}>
      {visiblehwview[classroom._id]?.[student._id] ? 'Hide Hw' : 'Verify Hw'}
    </h3>
  </div>
</div>

<div className="card" onClick={() => toggleform(classroom._id)}>
  <div className="card-content">
    <FontAwesomeIcon icon={faFileAlt} className="icon" />
    <h3 className={`form-text ${visibleForm[classroom._id] ? 'hidden' : ''}`}>
      {visibleForm[classroom._id] ? 'Hide Form' : 'Quick Form'}
    </h3>
  </div>
</div>

<div className="card" onClick={() => togglemeetlink(classroom._id)}>
  <div className="card-content">
    <FontAwesomeIcon icon={faVideo} className="icon" />
    <h3 className={`meet-text ${visiblemeetlink[classroom._id] ? 'hidden' : ''}`}>
      {visiblemeetlink[classroom._id] ? 'Hide Meet' : 'Live Lecture'}
    </h3>
  </div>
</div>

<div className="card" onClick={() => toggleChatVisibility(classroom._id)}>
  <div className="card-content">
    <FontAwesomeIcon icon={faComments} className="icon" />
    <h3 className={`chat-text ${chatVisibility[classroom._id] ? 'hidden' : ''}`}>
      {chatVisibility[classroom._id] ? 'Hide Chat' : 'Chat'}
    </h3>
  </div>
</div>
</div>






                          {attendanceVisibility[classroom._id]?.[student._id] && (
                              <AttendanceData classroomId={classroom._id} studentId={student._id} />
                            )}

                         

                          {feeVisibility[classroom._id]?.[student._id] && (
                              <FeeData classroomId={classroom._id} studentId={student._id} />
                          )}

                  
                {blacklistVisibility[classroom._id]?.[student._id] && (
                 <BlacklistData classroomId={classroom._id} studentId={student._id} />
                )}

 
                {testmarksVisibility[classroom._id]?.[student._id] && (
                 <TestMarksData classroomId={classroom._id} studentId={student._id} />
                )}

                
                  {visibleVideo[classroom._id] && (
                  <VideoDetails classroomId={classroom._id} />
                )}

                  
                  {visibleSchedule[classroom._id] && (
                  <ScheduleDetails classroomId={classroom._id} />
                )}

                 
                  {visibleStudyMaterial[classroom._id] && (
                  <StudyMaterialViewer classroomId={classroom._id} />
                )}

                            

                          {visiblehw[classroom._id]?.[student._id] && (
                              <HomeworkData classroomId={classroom._id} studentId={student._id} />
                          )}

                  
                  {hwassigFormVisibility[classroom._id] && (
            <AssignmentForm
              classroom={classroom}
              students={studentDetails[classroom._id] || []}
              closeForm={() =>
                sethwassigFormVisibility((prevState) => ({
                  ...prevState,
                  [classroom._id]: false, // Close the Marks form for this classroom
                }))
              }
            />
          )}

                          

                          {visiblehwview[classroom._id]?.[student._id] && (
                              <HomeworkViewer classroomId={classroom._id} studentId={student._id} />
                          )}


                  
                  {visibleForm[classroom._id] && (
                  <FormDetails classroomId={classroom._id} />
                )}

                  

                  {visiblemeetlink[classroom._id] && (
                  <GoogleMeetLinksStudent classroomId={classroom._id} />
                )}


                 
                  

        {classroom._id && studentId && chatVisibility[classroom._id] && (
          <Chat classroomId={classroom._id} studentId={studentId} />
        )}




                

                        </li>
                      ))
                    )}
                
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StudentDashboard;	
