import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StudentView from './StudentView'; 
import FacultyView from './FacultyView'; 
import AdminJoinRequests from './AdminJoinRequests'; 
import AttendanceData from './AttendanceData';
import AttendanceForm from './AttendanceForm';
import ClassroomStudents from './ClassroomStudents';
import FeeData from './FeeData'
import BlacklistData from './BlacklistData';
import MarksUpdateForm from './MarksUpdateForm';
import TestMarksData from './TestMarksData';
import YouTubeVideoUpdateForm from './YouTubeVideoUpdateForm';
import VideoDetails from './VideoDetails';
import ScheduleUpdateForm from './ScheduleUpdateForm';
import ScheduleDetails from './ScheduleDetails';
import StudyMaterialUploadForm from './StudyMaterialUploadForm';
import StudyMaterialViewer from './StudyMaterialViewer';
import HomeworkAssignmentForm from './HomeworkAssignmentForm';
import HomeworkData from './HomeworkData';
import Status from './Status';
import ClassroomDataForm from './ClassroomDataForm'; 
import FormDetails from './FormDetails';
import GoogleMeetLinkForm from './GoogleMeetLinkForm';
import GoogleMeetLinks from './GoogleMeetLinks';
import Chat from './Chat'; 
import EmailSubmissionForm from './EmailSubmissionForm';
import Emails from './Emails';
import SendEmailForm from './SendEmail';
import Whiteboard from './Whiteboard';
import './CSS/ExistingClassrooms.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers,faUserTie,faUserPlus,faClipboardCheck,faListCheck,faMoneyBillWave,faBan,faUpload,faListAlt,faVideo,faPlayCircle,faCalendarPlus,faCalendarAlt,faBookOpen,faBook,faClipboardList,faTasks,faCheckSquare,faEdit,faFileAlt,faChalkboardTeacher,faComments,faEnvelope,faBell,faEnvelopeOpenText,faChalkboard} from '@fortawesome/free-solid-svg-icons';

const ExistingClassrooms = ({ classrooms, setMessage, setError }) => {
  const [studentIdsToAdd, setStudentIdsToAdd] = useState({});
  const studentId = localStorage.getItem('studentId');
  const [facultyIdsToAdd, setFacultyIdsToAdd] = useState({}); // State for faculty IDs to add
  const [students, setStudents] = useState({});
  const [faculties, setFaculties] = useState({});
  const [visibleStudents, setVisibleStudents] = useState({});
  const [visibleFaculty, setVisibleFaculty] = useState({});
  const [visibleJoinRequests, setVisibleJoinRequests] = useState({});
  const [visibleMessage, setVisibleMessage] = useState('');
  const [visibleError, setVisibleError] = useState('');
  const [isCopied, setIsCopied] = useState({}); // New state to track copied status for each classroom and role type
  const [visibleFeeData, setVisibleFeeData] = useState({});
  const [visibleBlacklistData, setVisibleBlacklistData] = useState({});
  const [visibleAttendanceData, setVisibleAttendanceData] = useState({});
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [marksFormVisibility, setMarksFormVisibility] = useState({});
  const [visibletestmarks, setVisibleTestMarks] = useState({});
  const [videoFormVisibility, setVideoFormVisibility] = useState({});
  const [visibleVideo, setVisibleVideo] = useState({});
  const [scheduleFormVisibility, setScheduleFormVisibility] = useState({});
  const [visibleSchedule, setVisibleSchedule] = useState({});
  const [studyMaterialFormVisibility, setSudyMaterialFormVisibility] = useState({});
  const [visibleStudyMaterial, setVisibleStudyMaterial] = useState({});
  const [hwFormVisibility, sethwFormVisibility] = useState({});
  const [visiblehw, setVisiblehw] = useState({});
  const [statusFormVisibility, setstatusFormVisibility] = useState({});
  const [formVisibility, setFormVisibility] = useState({});
  const [visibleForm, setVisibleForm] = useState({});
  const [meetformVisibility, setmeetFormVisibility] = useState({});
  const [visiblemeetlink, setVisiblemeetlink] = useState({});
  const [chatVisibility, setChatVisibility] = useState({});
  const [emailFormVisibility, setemailFormVisibility] = useState({});
  const [visibleemail, setVisibleemail] = useState({});
  const [emailSendFormVisibility, setemailSendFormVisibility] = useState({});
  const [whiteboardVisibility, setwhiteboardVisibility] = useState({});
   const [detailsVisible, setDetailsVisible] = useState({});

  useEffect(() => {
    if (visibleMessage) {
      const timer = setTimeout(() => {
        setVisibleMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visibleMessage]);

  useEffect(() => {
    if (visibleError) {
      const timer = setTimeout(() => {
        setVisibleError('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visibleError]);

  //to add student in classrrom by ID
  const handleAddStudent = async (classroomId) => {
    if (!studentIdsToAdd[classroomId]) {
      setVisibleError('Please enter a valid student ID.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5000/api/classrooms/${classroomId}/students`,
        { studentIds: [studentIdsToAdd[classroomId]] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setVisibleMessage(response.data.message || 'Student added successfully');
      setStudentIdsToAdd((prev) => ({ ...prev, [classroomId]: '' }));
    } catch (err) {
      setVisibleError(err.response?.data?.message || 'Failed to add student');
    }
  };

//to add faculty to classrrom by ID
  const handleAddFaculty = async (classroomId) => {
    if (!facultyIdsToAdd[classroomId]) {
      setVisibleError('Please enter a valid faculty ID.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5000/api/classrooms/${classroomId}/faculties`,
        { facultyIds: [facultyIdsToAdd[classroomId]] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setVisibleMessage(response.data.message || 'Faculty added successfully');
      setFacultyIdsToAdd((prev) => ({ ...prev, [classroomId]: '' }));
    } catch (err) {
      setVisibleError(err.response?.data?.message || 'Failed to add faculty');
    }
  };

//To Remove Faculty from a classroom
const handleRemoveFaculty = async (classroomId, facultyId) => {
  try {
   

    const token = localStorage.getItem('token');
    
    // Optionally, set loading state to true here
    const response = await axios.delete(
      `http://localhost:5000/api/classrooms/${classroomId}/faculties/${facultyId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      setVisibleMessage(response.data.message || 'Faculty removed successfully');
      
      // Refresh the faculties list
      setFaculties((prev) => {
        const updatedFaculties = { ...prev };
        if (updatedFaculties[classroomId]) {
          updatedFaculties[classroomId] = updatedFaculties[classroomId].filter(faculty => faculty._id !== facultyId);
        }
        return updatedFaculties;
      });
    } else {
      setVisibleError('Unexpected response status: ' + response.status);
    }
  } catch (err) {
    setVisibleError(err.response?.data?.message || 'Failed to remove faculty');
  } finally {
    // Optionally, set loading state to false here
  }
};


//to handle remove student
const handleRemoveStudent = async (classroomId, studentId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(
      `http://localhost:5000/api/classrooms/${classroomId}/students/${studentId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.status === 200) {
      setVisibleMessage(response.data.message || 'Student removed successfully');
      setStudents((prev) => {
        const updatedStudents = { ...prev };
        if (updatedStudents[classroomId]) {
          updatedStudents[classroomId] = updatedStudents[classroomId].filter(student => student._id !== studentId);
        }
        return updatedStudents;
      });
    }
  } catch (err) {
    setVisibleError(err.response?.data?.message || 'Failed to remove student');
  }
};



//handle to show all student
  const handleShowStudents = async (classroomId) => {
    if (visibleStudents[classroomId]) {
      setVisibleStudents((prev) => ({ ...prev, [classroomId]: false }));
    } else {
      if (!students[classroomId]) {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`http://localhost:5000/api/classrooms/${classroomId}/students`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setStudents((prev) => ({ ...prev, [classroomId]: response.data }));
        } catch (err) {
          setVisibleError('Failed to fetch students');
        }
      }
      setVisibleStudents((prev) => ({ ...prev, [classroomId]: true }));
    }
  };


//handle show faculty
  const handleShowFaculty = async (classroomId) => {
    if (visibleFaculty[classroomId]) {
      setVisibleFaculty((prev) => ({ ...prev, [classroomId]: false }));
    } else {
      if (!faculties[classroomId]) {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`http://localhost:5000/api/classrooms/${classroomId}/faculties`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const fetchedFaculties = await response.json();
          setFaculties((prev) => ({ ...prev, [classroomId]: fetchedFaculties }));
        } catch (error) {
          console.error('Error fetching faculties:', error);
          setVisibleError('Failed to fetch faculties');
        }
      }
      setVisibleFaculty((prev) => ({ ...prev, [classroomId]: true }));
    }
  };

  const handleShowJoinRequests = (classroomId) => {
    setVisibleJoinRequests((prev) => ({ ...prev, [classroomId]: !prev[classroomId] }));
  };

  const handlePaste = async (classroomId, roleType) => {
    try {
      const text = await navigator.clipboard.readText(); // Read text from clipboard
      if (roleType === 'student') {
        setStudentIdsToAdd((prev) => ({ ...prev, [classroomId]: text }));
      } else if (roleType === 'faculty') {
        setFacultyIdsToAdd((prev) => ({ ...prev, [classroomId]: text }));
      }
      setIsCopied((prev) => ({ ...prev, [`${classroomId}-${roleType}`]: true })); // Set copied status for the classroom and role type

      // Reset the "Copied!" message after 3 seconds
      setTimeout(() => {
        setIsCopied((prev) => ({ ...prev, [`${classroomId}-${roleType}`]: false }));
      }, 3000);
    } catch (error) {
      console.error('Failed to read clipboard contents:', error);
    }
  };

  const toggleAttendanceData = (classroomId) => {
    setVisibleAttendanceData((prev) => ({
      ...prev,
      [classroomId]: !prev[classroomId],
    }));
  };

  const toggleFeeData = (classroomId) => {
    setVisibleFeeData((prev) => ({
      ...prev,
      [classroomId]: !prev[classroomId],
    }));
  };

  const toggleBlacklistData = (classroomId) => {
    setVisibleBlacklistData((prev) => ({
      ...prev,
      [classroomId]: !prev[classroomId],
    }));
  };


  const toggletestmarks = (classroomId) => {
    setVisibleTestMarks((prev) => ({
      ...prev,
      [classroomId]: !prev[classroomId],
    }));
  };


  const toggleAttendanceForm = (classroom) => {
    setSelectedClassroom((prev) => (prev?._id === classroom._id ? null : classroom));
  };

  const toggleMarksForm = (classroom) => {
    setMarksFormVisibility((prevState) => ({
      ...prevState,
      [classroom._id]: !prevState[classroom._id], // Toggle visibility for this classroom
    }));
  };


  const toggleVideoForm = (classroom) => {
    setVideoFormVisibility((prevState) => ({
      ...prevState,
      [classroom._id]: !prevState[classroom._id], // Toggle visibility for this classroom
    }));
  };


  const togglevideo = (classroomId) => {
    setVisibleVideo((prev) => ({
      ...prev,
      [classroomId]: !prev[classroomId],
    }));
  };

  const toggleScheduleForm = (classroom) => {
    setScheduleFormVisibility((prevState) => ({
      ...prevState,
      [classroom._id]: !prevState[classroom._id], // Toggle visibility for this classroom
    }));
  };

  const toggleschedule = (classroomId) => {
    setVisibleSchedule((prev) => ({
      ...prev,
      [classroomId]: !prev[classroomId],
    }));
  };

  const toggleStudyMaterialForm = (classroom) => {
    setSudyMaterialFormVisibility((prevState) => ({
      ...prevState,
      [classroom._id]: !prevState[classroom._id], // Toggle visibility for this classroom
    }));
  };

  const togglestudymaterial = (classroomId) => {
    setVisibleStudyMaterial((prev) => ({
      ...prev,
      [classroomId]: !prev[classroomId],
    }));
  };

  const togglehwForm = (classroom) => {
    sethwFormVisibility((prevState) => ({
      ...prevState,
      [classroom._id]: !prevState[classroom._id], // Toggle visibility for this classroom
    }));
  };

  const togglehw = (classroomId) => {
    setVisiblehw((prev) => ({
      ...prev,
      [classroomId]: !prev[classroomId],
    }));
  };

  const togglestatusForm = (classroom) => {
    setstatusFormVisibility((prevState) => ({
      ...prevState,
      [classroom._id]: !prevState[classroom._id], // Toggle visibility for this classroom
    }));
  };

  const toggleFormVisibility = (classroom) => {
    setFormVisibility((prevState) => ({
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

  const togglemeetFormVisibility = (classroom) => {
    setmeetFormVisibility((prevState) => ({
      ...prevState,
      [classroom._id]: !prevState[classroom._id], // Toggle visibility for this classroom
    }));
  };

  const togglemeetlink = (classroomId) => {
    setVisiblemeetlink((prev) => ({
      ...prev,
      [classroomId]: !prev[classroomId],
    }));
  };

  const toggleChatVisibility = (classroomId) => {
    setChatVisibility((prev) => ({
      ...prev,
      [classroomId]: !prev[classroomId], // Toggle visibility for the specific classroom
    }));
  };

  
  const toggleemailForm = (classroom) => {
    setemailFormVisibility((prevState) => ({
      ...prevState,
      [classroom._id]: !prevState[classroom._id], // Toggle visibility for this classroom
    }));
  };

  const toggleemail = (classroomId) => {
    setVisibleemail((prev) => ({
      ...prev,
      [classroomId]: !prev[classroomId],
    }));
  };

  const toggleemailSendForm = (classroom) => {
    setemailSendFormVisibility((prevState) => ({
      ...prevState,
      [classroom._id]: !prevState[classroom._id], // Toggle visibility for this classroom
    }));
  };

  const togglewhiteboardVisibility = (classroomId) => {
    setwhiteboardVisibility((prev) => ({
      ...prev,
      [classroomId]: !prev[classroomId], // Toggle visibility for the specific classroom
    }));
  };

  const toggleDetailsVisibility = (classroomId) => {
    setDetailsVisible((prev) => ({
      ...prev,
      [classroomId]: !prev[classroomId],
    }));
  };

 

  return (
    <div>
      {visibleMessage && <p style={{ color: 'green' }}>{visibleMessage}</p>}
      {visibleError && <p style={{ color: 'red' }}>{visibleError}</p>}

      <h2 className="classroom-heading-admin">Existing Classrooms</h2>
      <ul className="classroom-list-admin">
        {classrooms.length === 0 ? (
          <p className="no-classrooms-message-admindashboard">No classrooms available</p>
        ) : (
          classrooms.map((classroom) => (
            <li key={classroom._id}  className="classroom-item-admin">
              <div><h4>
                Class: {classroom.name}</h4>
               
                <p><strong>Subject:</strong> {classroom.subject}</p>
              
                <p><strong>Timing:</strong> {classroom.startTiming} to {classroom.endTiming}</p>
               
                <p><strong>Join Code:</strong> {classroom.code}</p>
                

                {/* Add Student Section */}
                <input
                  type="text"
                  placeholder="Enter student ID to add"
                  value={studentIdsToAdd[classroom._id] || ''}
                  onChange={(e) => setStudentIdsToAdd((prev) => ({ ...prev, [classroom._id]: e.target.value }))}
                 className="user-code-input"
                />
                <button onClick={() => handlePaste(classroom._id, 'student')} className="toggle-paste-btn">
                  Paste ID
                </button>
                
                <button onClick={() => handleAddStudent(classroom._id)} className='add-code-button'>
                  Add Student
                </button>
                {isCopied[`${classroom._id}-student`] && (
                  <span style={{ color: 'green', marginLeft: '10px' }}>Pasted!</span>
                )}

                <br /> {/* Line break for separation */}

                {/* Add Faculty Section */}
                <input
                  type="text"
                  placeholder="Enter faculty ID to add"
                  value={facultyIdsToAdd[classroom._id] || ''}
                  onChange={(e) => setFacultyIdsToAdd((prev) => ({ ...prev, [classroom._id]: e.target.value }))}
                  className="user-code-input"
                />
                <button onClick={() => handlePaste(classroom._id, 'faculty')} className="toggle-paste-btn">
                  Paste ID
                </button>
                
                <button onClick={() => handleAddFaculty(classroom._id)} className='add-code-button'>
                  Add Faculty
                </button>
                {isCopied[`${classroom._id}-faculty`] && (
                  <span style={{ color: 'green', marginLeft: '10px' }}>Pasted!</span>
                )}
              </div>
              <div style={{ marginTop: '7px', marginBottom: '7px' }}>
              <button 
  onClick={() => toggleDetailsVisibility(classroom._id)} 
  className="view-details-btn-admin"
>
  {detailsVisible[classroom._id] ? 'Hide Details' : 'View Details'}
</button>

{detailsVisible[classroom._id] && (
  <div className="details-buttons">
    <h3>More Details</h3>
    <div className="card-container-admin">
    <div className="card" onClick={() => handleShowStudents(classroom._id)}>
      
  <div className="card-content">
    <FontAwesomeIcon icon={faUsers} className="icon-admin" />
    <h3 className={`hide-text ${visibleStudents[classroom._id] ? 'hidden' : ''}`}>
      {visibleStudents[classroom._id] ? 'Hide Students' : 'View Students'}
    </h3>
  </div>
</div>

<div className="card" onClick={() => handleShowFaculty(classroom._id)}>
  <div className="card-content">
    <FontAwesomeIcon icon={faUserTie} className="icon-admin" />
    <h3 className={`hide-text ${visibleFaculty[classroom._id] ? 'hidden' : ''}`}>
      {visibleFaculty[classroom._id] ? 'Hide Faculty' : 'View Faculty'}
    </h3>
  </div>
</div>

<div className="card" onClick={() => handleShowJoinRequests(classroom._id)}>
  <div className="card-content">
    <FontAwesomeIcon icon={faUserPlus} className="icon-admin" />
    <h3 className={`hide-text ${visibleJoinRequests[classroom._id] ? 'hidden' : ''}`}>
      {visibleJoinRequests[classroom._id] ? 'Hide Join Requests' : 'Join Requests'}
    </h3>
  </div>
</div>

<div className="card" onClick={() => toggleAttendanceForm(classroom)}>
  <div className="card-content">
    <FontAwesomeIcon icon={faClipboardCheck} className="icon-admin" />
    <h3 className={`hide-text ${selectedClassroom?._id === classroom._id ? 'hidden' : ''}`}>
      {selectedClassroom?._id === classroom._id ? 'Hide Attendance' : 'Mark Attendance'}
    </h3>
  </div>
</div>

<div className="card" onClick={() => toggleAttendanceData(classroom._id)}>
  <div className="card-content">
    <FontAwesomeIcon icon={faListCheck} className="icon-admin" />
    <h3 className={`hide-text ${visibleAttendanceData[classroom._id] ? 'hidden' : ''}`}>
      {visibleAttendanceData[classroom._id] ? 'Hide Attendance Data' : 'Attendance Data'}
    </h3>
  </div>
</div>

<div className="card" onClick={() => toggleFeeData(classroom._id)}>
  <div className="card-content">
    <FontAwesomeIcon icon={faMoneyBillWave} className="icon-admin" />
    <h3 className={`hide-text ${visibleFeeData[classroom._id] ? 'hidden' : ''}`}>
      {visibleFeeData[classroom._id] ? 'Hide Fee Data' : 'Fee Data'}
    </h3>
  </div>
</div>

<div className="card" onClick={() => toggleBlacklistData(classroom._id)}>
  <div className="card-content">
    <FontAwesomeIcon icon={faBan} className="icon-admin" />
    <h3 className={`hide-text ${visibleBlacklistData[classroom._id] ? 'hidden' : ''}`}>
      {visibleBlacklistData[classroom._id] ? 'Hide Blacklist Data' : 'Blacklist Data'}
    </h3>
  </div>
</div>

<div className="card" onClick={() => toggleMarksForm(classroom)}>
  <div className="card-content">
    <FontAwesomeIcon icon={faUpload} className="icon-admin" />
    <h3 className={`hide-text ${marksFormVisibility[classroom._id] ? 'hidden' : ''}`}>
      {marksFormVisibility[classroom._id] ? 'Hide Marks' : 'Upload Marks'}
    </h3>
  </div>
</div>

<div className="card" onClick={() => toggletestmarks(classroom._id)}>
  <div className="card-content">
    <FontAwesomeIcon icon={faListAlt} className="icon-admin" />
    <h3 className={`hide-text ${visibletestmarks[classroom._id] ? 'hidden' : ''}`}>
      {visibletestmarks[classroom._id] ? 'Hide Marks' : 'Show Marks'}
    </h3>
  </div>
</div>

<div className="card" onClick={() => toggleVideoForm(classroom)}>
  <div className="card-content">
    <FontAwesomeIcon icon={faVideo} className="icon-admin" />
    <h3 className={`hide-text ${videoFormVisibility[classroom._id] ? 'hidden' : ''}`}>
      {videoFormVisibility[classroom._id] ? 'Hide Videos' : 'Upload Videos'}
    </h3>
  </div>
</div>

<div className="card" onClick={() => togglevideo(classroom._id)}>
  <div className="card-content">
    <FontAwesomeIcon icon={faPlayCircle} className="icon-admin" />
    <h3 className={`hide-text ${visibleVideo[classroom._id] ? 'hidden' : ''}`}>
      {visibleVideo[classroom._id] ? 'Hide Video' : 'Show Videos'}
    </h3>
  </div>
</div>

<div className="card" onClick={() => toggleScheduleForm(classroom)}>
  <div className="card-content">
    <FontAwesomeIcon icon={faCalendarPlus} className="icon-admin" />
    <h3 className={`hide-text ${scheduleFormVisibility[classroom._id] ? 'hidden' : ''}`}>
      {scheduleFormVisibility[classroom._id] ? 'Hide Update Schedule' : 'Update Schedule'}
    </h3>
  </div>
</div>

<div className="card" onClick={() => toggleschedule(classroom._id)}>
  <div className="card-content">
    <FontAwesomeIcon icon={faCalendarAlt} className="icon-admin" />
    <h3 className={`hide-text ${visibleSchedule[classroom._id] ? 'hidden' : ''}`}>
      {visibleSchedule[classroom._id] ? 'Hide Schedule' : 'Show Schedule'}
    </h3>
  </div>
</div>

<div className="card" onClick={() => toggleStudyMaterialForm(classroom)}>
  <div className="card-content">
    <FontAwesomeIcon icon={faBookOpen} className="icon-admin" />
    <h3 className={`hide-text ${studyMaterialFormVisibility[classroom._id] ? 'hidden' : ''}`}>
      {studyMaterialFormVisibility[classroom._id] ? 'Hide Upload' : 'Upload Notes'}
    </h3>
  </div>
</div>

<div className="card" onClick={() => togglestudymaterial(classroom._id)}>
  <div className="card-content">
    <FontAwesomeIcon icon={faBook} className="icon-admin" />
    <h3 className={`hide-text ${visibleStudyMaterial[classroom._id] ? 'hidden' : ''}`}>
      {visibleStudyMaterial[classroom._id] ? 'Hide Study' : 'Show Notes'}
    </h3>
  </div>
</div>

<div className="card" onClick={() => togglehwForm(classroom)}>
  <div className="card-content">
    <FontAwesomeIcon icon={faClipboardList} className="icon-admin" />
    <h3 className={`hide-text ${hwFormVisibility[classroom._id] ? 'hidden' : ''}`}>
      {hwFormVisibility[classroom._id] ? 'Hide HW' : 'Assign HW'}
    </h3>
  </div>
</div>

<div className="card" onClick={() => togglehw(classroom._id)}>
  <div className="card-content">
    <FontAwesomeIcon icon={faTasks} className="icon-admin" />
    <h3 className={`hide-text ${visiblehw[classroom._id] ? 'hidden' : ''}`}>
      {visiblehw[classroom._id] ? 'Hide HW' : 'View HW'}
    </h3>
  </div>
</div>

<div className="card" onClick={() => togglestatusForm(classroom)}>
  <div className="card-content">
    <FontAwesomeIcon icon={faCheckSquare} className="icon-admin" />
    <h3 className={`hide-text ${statusFormVisibility[classroom._id] ? 'hidden' : ''}`}>
      {statusFormVisibility[classroom._id] ? 'Hide HW Status' : 'Update HW Status'}
    </h3>
  </div>
</div>

<div className="card" onClick={() => toggleFormVisibility(classroom)}>
  <div className="card-content">
    <FontAwesomeIcon icon={faEdit} className="icon-admin" />
    <h3 className={`hide-text ${formVisibility[classroom._id] ? 'hidden' : ''}`}>
      {formVisibility[classroom._id] ? 'Hide Form' : 'Quick Form'}
    </h3>
  </div>
</div>

<div className="card" onClick={() => toggleform(classroom._id)}>
  <div className="card-content">
    <FontAwesomeIcon icon={faFileAlt} className="icon-admin" />
    <h3 className={`hide-text ${visibleForm[classroom._id] ? 'hidden' : ''}`}>
      {visibleForm[classroom._id] ? 'Hide Forms' : 'Forms'}
    </h3>
  </div>
</div>

<div className="card" onClick={() => togglemeetFormVisibility(classroom)}>
  <div className="card-content">
    <FontAwesomeIcon icon={faVideo} className="icon-admin" />
    <h3 className={`hide-text ${meetformVisibility[classroom._id] ? 'hidden' : ''}`}>
      {meetformVisibility[classroom._id] ? 'Hide Live Lecture' : 'Update Live Lecture'}
    </h3>
  </div>
</div>

<div className="card" onClick={() => togglemeetlink(classroom._id)}>
  <div className="card-content">
    <FontAwesomeIcon icon={faChalkboardTeacher} className="icon-admin" />
    <h3 className={`hide-text ${visiblemeetlink[classroom._id] ? 'hidden' : ''}`}>
      {visiblemeetlink[classroom._id] ? 'Hide Lecture' : 'Lecture Info'}
    </h3>
  </div>
</div>

<div className="card" onClick={() => toggleChatVisibility(classroom._id)}>
  <div className="card-content">
    <FontAwesomeIcon icon={faComments} className="icon-admin" />
    <h3 className={`hide-text ${chatVisibility[classroom._id] ? 'hidden' : ''}`}>
      {chatVisibility[classroom._id] ? 'Hide Chat' : 'Chat'}
    </h3>
  </div>
</div>

<div className="card" onClick={() => toggleemailForm(classroom)}>
  <div className="card-content">
    <FontAwesomeIcon icon={faEnvelope} className="icon-admin" />
    <h3 className={`hide-text ${emailFormVisibility[classroom._id] ? 'hidden' : ''}`}>
      {emailFormVisibility[classroom._id] ? 'Hide Email' : 'Update Email'}
    </h3>
  </div>
</div>

<div className="card" onClick={() => toggleemail(classroom._id)}>
  <div className="card-content">
    <FontAwesomeIcon icon={faBell} className="icon-admin" />
    <h3 className={`hide-text ${visibleemail[classroom._id] ? 'hidden' : ''}`}>
      {visibleemail[classroom._id] ? 'Hide Notification' : 'Send Notification'}
    </h3>
  </div>
</div>

<div className="card" onClick={() => toggleemailSendForm(classroom)}>
  <div className="card-content">
    <FontAwesomeIcon icon={faEnvelopeOpenText} className="icon-admin" />
    <h3 className={`hide-text ${emailSendFormVisibility[classroom._id] ? 'hidden' : ''}`}>
      {emailSendFormVisibility[classroom._id] ? 'Hide Email Form' : 'Send Email'}
    </h3>
  </div>
</div>

<div className="card" onClick={() => togglewhiteboardVisibility(classroom._id)}>
  <div className="card-content">
    <FontAwesomeIcon icon={faChalkboard} className="icon-admin" />
    <h3 className={`hide-text ${whiteboardVisibility[classroom._id] ? 'hidden' : ''}`}>
      {whiteboardVisibility[classroom._id] ? 'Hide Virtual Board' : 'Virtual Board'}
    </h3>
  </div>
</div>

                  

                 </div>
                 {classroom && (
                  <div style={{ marginTop: '10px' }}> {/* Adjust value as needed */}
                    <ClassroomStudents classroomId={classroom._id} />
                  </div>
                )}
                 </div>)}
              </div> 
              {visibleFaculty[classroom._id] && faculties[classroom._id] && (
                <div style={{ marginTop: '5px' }}>
                  <FacultyView 
                    faculties={faculties[classroom._id]} 
                    onRemoveFaculty={(facultyId) => handleRemoveFaculty(classroom._id, facultyId)} // Pass remove function
                  />
                </div>
              )}
              {visibleStudents[classroom._id] && students[classroom._id] && (
                <div style={{ marginTop: '5px' }}>
                  <StudentView 
                    students={students[classroom._id]} 
                    onRemoveStudent={(studentId) => handleRemoveStudent(classroom._id, studentId)} // Pass remove function
                  />
                </div>
              )}
              {visibleJoinRequests[classroom._id] && (
                <div style={{ marginTop: '5px' }}>
                  <AdminJoinRequests classroomId={classroom._id} />
                </div>
              )} <br />
              {/* Conditionally render AttendanceData based on visibility state */}
              {visibleAttendanceData[classroom._id] && (
                  <AttendanceData classroomId={classroom._id} />
                )}

                {/* Conditionally render AttendanceData based on visibility state */}
              {visibleFeeData[classroom._id] && (
                  <FeeData classroomId={classroom._id} />
                )}

                {/* Conditionally render AttendanceData based on visibility state */}
              {visibleBlacklistData[classroom._id] && (
                  <BlacklistData classroomId={classroom._id} />
                )}

                {/* Conditionally render AttendanceData based on visibility state */}
              {visibletestmarks[classroom._id] && (
                  <TestMarksData classroomId={classroom._id} />
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

                {visiblehw[classroom._id] && (
                  <HomeworkData classroomId={classroom._id} />
                )}

                {visibleForm[classroom._id] && (
                  <FormDetails classroomId={classroom._id} />
                )}

                {visiblemeetlink[classroom._id] && (
                  <GoogleMeetLinks classroomId={classroom._id} />
                )}

                {classroom._id && studentId && chatVisibility[classroom._id] && (
                <Chat classroomId={classroom._id} studentId={studentId} />
                )}

                {visibleemail[classroom._id] && (
                  <Emails classroomId={classroom._id} />
                )}

                {classroom._id && studentId && whiteboardVisibility[classroom._id] && (
                <Whiteboard classroomId={classroom._id} studentId={studentId} />
                )}


           

                {/* Display AttendanceForm directly below the specific classroom */}
                {selectedClassroom?._id === classroom._id && (
                  <AttendanceForm
                    classroom={selectedClassroom}
                    students={students[classroom._id] || []}
                    closeForm={() => setSelectedClassroom(null)}
                  />
                  
                )}


                {/* Display MarksUpdateForm if marksFormVisible is true for this classroom */}
          {marksFormVisibility[classroom._id] && (
            <MarksUpdateForm
              classroom={classroom}
              students={students[classroom._id] || []}
              closeForm={() =>
                setMarksFormVisibility((prevState) => ({
                  ...prevState,
                  [classroom._id]: false, // Close the Marks form for this classroom
                }))
              }
            />
          )}


            {videoFormVisibility[classroom._id] && (
            <YouTubeVideoUpdateForm
              classroom={classroom}
              closeForm={() =>
                setVideoFormVisibility((prevState) => ({
                  ...prevState,
                  [classroom._id]: false, // Close the video form for this classroom
                }))
              }
            />
          )}


          {scheduleFormVisibility[classroom._id] && (
            <ScheduleUpdateForm
              classroom={classroom}
              closeForm={() =>
                setScheduleFormVisibility((prevState) => ({
                  ...prevState,
                  [classroom._id]: false, // Close the video form for this classroom
                }))
              }
            />
          )}

        {studyMaterialFormVisibility[classroom._id] && (
            <StudyMaterialUploadForm
              classroom={classroom}
              closeForm={() =>
                setSudyMaterialFormVisibility((prevState) => ({
                  ...prevState,
                  [classroom._id]: false, // Close the video form for this classroom
                }))
              }
            />
          )}

            {hwFormVisibility[classroom._id] && (
            <HomeworkAssignmentForm
              classroom={classroom}
              students={students[classroom._id] || []}
              closeForm={() =>
                sethwFormVisibility((prevState) => ({
                  ...prevState,
                  [classroom._id]: false, // Close the Marks form for this classroom
                }))
              }
            />
          )}

            {statusFormVisibility[classroom._id] && (
            <Status
              classroom={classroom}
              students={students[classroom._id] || []}
              closeForm={() =>
                setstatusFormVisibility((prevState) => ({
                  ...prevState,
                  [classroom._id]: false, // Close the Marks form for this classroom
                }))
              }
            />
          )}

          {formVisibility[classroom._id] && (
            <ClassroomDataForm
              classroom={classroom}
              closeForm={() =>
                setFormVisibility((prevState) => ({
                  ...prevState,
                  [classroom._id]: false, // Close the form for this classroom
                }))
              }
            />
          )}

            {meetformVisibility[classroom._id] && (
            <GoogleMeetLinkForm
              classroom={classroom}
              closeForm={() =>
                setmeetFormVisibility((prevState) => ({
                  ...prevState,
                  [classroom._id]: false, // Close the form for this classroom
                }))
              }
            />
          )}

          {emailFormVisibility[classroom._id] && (
            <EmailSubmissionForm
              classroom={classroom}
              students={students[classroom._id] || []}
              closeForm={() =>
                setemailFormVisibility((prevState) => ({
                  ...prevState,
                  [classroom._id]: false, // Close the Marks form for this classroom
                }))
              }
            />
          )}

            {emailSendFormVisibility[classroom._id] && (
            <SendEmailForm
              classroom={classroom}
              students={students[classroom._id] || []}
              closeForm={() =>
                setemailSendFormVisibility((prevState) => ({
                  ...prevState,
                  [classroom._id]: false, // Close the Marks form for this classroom
                }))
              }
            />
          )}


          
              
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default ExistingClassrooms;
