import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AttendanceForm from './AttendanceForm';
import AttendanceData from './AttendanceData';
import ClassroomStudents from './Student_inFaculty';
import BlacklistForm from './BlacklistForm';
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
import ViewUser from '../components/ViewUsers';
import EmailSubmissionForm from './EmailSubmissionForm';
import Emails from './Emails';
import './CSS/FacultyDashboard.css'
import { FaUser } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserTie,faChalkboard,faInfoCircle,faCalendarCheck,faCalendarAlt,faBan,faUpload,faChartLine,faVideo,faPlayCircle,faCalendar,faBookOpen,faTasks,faEye,faEdit,faFileAlt,faClipboardList,faComments,faEnvelopeOpenText,faPaperPlane} from '@fortawesome/free-solid-svg-icons';
import Whiteboard from './Whiteboard';

const FacultyDashboard = () => {
  const [classrooms, setClassrooms] = useState([]);
  const studentId = localStorage.getItem('studentId');
  const [facultyDetails, setFacultyDetails] = useState({});
  const [studentDetails, setStudentDetails] = useState({});
  const [visibleError, setVisibleError] = useState('');
  const [visibleFaculty, setVisibleFaculty] = useState({});
  const [visibleStudents, setVisibleStudents] = useState({});
  const [attendanceVisibility, setAttendanceVisibility] = useState({}); // New state for attendance visibility
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [visibleAttendanceData, setVisibleAttendanceData] = useState({});
  const [blacklistFormVisibility, setBlacklistFormVisibility] = useState({});
  const [blacklistVisibility, setBlacklistVisibility] = useState({});
  const [marksFormVisibility, setMarksFormVisibility] = useState({});
  const [testmarksVisibility, setTestMarksVisibility] = useState({});
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
  const [userVisibility, setuserVisibility] = useState({});
  const [emailFormVisibility, setemailFormVisibility] = useState({});
  const [visibleemail, setVisibleemail] = useState({});
  const [detailsVisible, setDetailsVisible] = useState({});
  const [studentDetailsVisibility, setStudentDetailsVisibility] = useState({});
  const [whiteboardVisibility, setwhiteboardVisibility] = useState({});

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/faculties/classrooms', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setClassrooms(response.data);
      } catch (err) {
        setVisibleError(err.response?.data?.message || 'Failed to fetch classrooms');
      }
    };

    fetchClassrooms();
  }, []);

  const fetchFacultyDetails = async (classroomId) => {
    if (facultyDetails[classroomId]) {
      setVisibleFaculty((prev) => ({ ...prev, [classroomId]: !prev[classroomId] }));
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/classrooms/${classroomId}/faculties`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFacultyDetails((prev) => ({
        ...prev,
        [classroomId]: response.data,
      }));
      setVisibleFaculty((prev) => ({ ...prev, [classroomId]: true }));
    } catch (err) {
      setVisibleError(err.response?.data?.message || 'Failed to fetch faculty details');
    }
  };

  const fetchStudentDetails = async (classroomId) => {
    if (studentDetails[classroomId]) {
      setVisibleStudents((prev) => ({ ...prev, [classroomId]: !prev[classroomId] }));
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/classrooms/${classroomId}/students`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBlacklistFormVisibility(response.data.reduce((acc, student) => {
        acc[student._id] = false;
        return acc;
      }, {}));

      setStudentDetails((prev) => ({
        ...prev,
        [classroomId]: response.data,
      }));
      setVisibleStudents((prev) => ({ ...prev, [classroomId]: true }));
      // Initialize attendance visibility for this classroom
      setAttendanceVisibility((prev) => ({
        ...prev,
        [classroomId]: response.data.reduce((acc, student) => {
          acc[student._id] = false; // Hide attendance by default
          return acc;
        }, {})
      }));
    } catch (err) {
      setVisibleError(err.response?.data?.message || 'Failed to fetch student details');
    }
  };

  const toggleAttendanceForm = (classroom) => {
    setSelectedClassroom((prev) => (prev?._id === classroom._id ? null : classroom));
  };

  const toggleMarksForm = (classroom) => {
    setMarksFormVisibility((prev) => (prev?._id === classroom._id ? null : classroom));
  };


  const toggleAttendanceData = (classroomId) => {
    setVisibleAttendanceData((prev) => ({
      ...prev,
      [classroomId]: !prev[classroomId],
    }));
  };

  const toggleStudentAttendance = (studentId, classroomId) => {
    setAttendanceVisibility((prev) => ({
      ...prev,
      [classroomId]: {
        ...prev[classroomId],
        [studentId]: !prev[classroomId][studentId],
      },
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

  const toggletestmarks = (classroomId) => {
    setTestMarksVisibility((prev) => ({
      ...prev,
      [classroomId]: !prev[classroomId],
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

  const toggleuserVisibility = (studentId) => {
    setuserVisibility((prev) => ({
      ...prev,
      [studentId]: !prev[studentId], // Toggle visibility based on studentId
    }));
  };

  const toggleemail = (classroomId) => {
    setVisibleemail((prev) => ({
      ...prev,
      [classroomId]: !prev[classroomId],
    }));
  };

  const toggleemailForm = (classroom) => {
    setemailFormVisibility((prevState) => ({
      ...prevState,
      [classroom._id]: !prevState[classroom._id], // Toggle visibility for this classroom
    }));
  };

  const toggleDetailsVisibility = (classroomId) => {
    setDetailsVisible((prev) => ({
      ...prev,
      [classroomId]: !prev[classroomId],
    }));
  };

  const toggleStudentDetails = (studentId) => {
    setStudentDetailsVisibility((prevState) => ({
      ...prevState,
      [studentId]: !prevState[studentId],
    }));
  };

  const togglewhiteboardVisibility = (classroomId) => {
    setwhiteboardVisibility((prev) => ({
      ...prev,
      [classroomId]: !prev[classroomId], // Toggle visibility for the specific classroom
    }));
  };



  return (
    <div className="faculty-page">
      {visibleError && <p style={{ color: 'red' }}>{visibleError}</p>}
      <h1 class="dashboard-heading-faculty">Faculty Dashboard</h1>
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
      <h2 className="classroom-heading-faculty">Your Classrooms</h2>
      <ul className="classroom-list-faculty">
        {classrooms.length === 0 ? (
          <p className="no-classrooms-message-facultydashboard">No classrooms assigned</p>
        ) : (
          classrooms.map((classroom) => (
            <li key={classroom._id} className="classroom-item-faculty">
              <div>
               <h4> Class: {classroom.name}</h4>
                <p><strong>Subject:</strong> {classroom.subject}</p>
                <p><strong>Timing:</strong> {classroom.startTiming} to {classroom.endTiming}</p>
                <p><strong>Join Code:</strong> {classroom.code}</p>
                
                <div style={{ marginTop: '7px', marginBottom: '7px' }}>
                <button 
  onClick={() => toggleDetailsVisibility(classroom._id)} 
  className="view-details-btn"
>
  {detailsVisible[classroom._id] ? 'Hide Details' : 'View Details'}
</button>

{detailsVisible[classroom._id] && (
  <div className="details-buttons">
    <h3>More Details</h3>
    
    <div className="card-container">
    <div className="card" onClick={() => fetchFacultyDetails(classroom._id)}>
  <div className="card-content">
    <FontAwesomeIcon icon={faUserTie} className="icon" />
    <h3 className={`faculty-text ${visibleFaculty[classroom._id] ? 'hidden' : ''}`}>
      {visibleFaculty[classroom._id] ? 'Hide Faculty' : 'View Faculty'}
    </h3>
  </div>
</div>



    
<div className="card" onClick={() => fetchStudentDetails(classroom._id)}>
  <div className="card-content">
    <FontAwesomeIcon icon={faInfoCircle} className="icon" />
    <h3 className={`quick-info-text ${visibleStudents[classroom._id] ? 'hidden' : ''}`}>
      {visibleStudents[classroom._id] ? 'Hide Quick Info' : 'Quick Info'}
    </h3>
  </div>
</div>



<div className="card" onClick={() => toggleAttendanceForm(classroom)}>
  <div className="card-content">
    <FontAwesomeIcon icon={faCalendarCheck} className="icon" />
    <h3 className={`quick-info-text ${selectedClassroom?._id === classroom._id ? 'hidden' : ''}`}>
      {selectedClassroom?._id === classroom._id ? 'Hide Attendance' : 'Mark Attendance'}
    </h3>
  </div>
</div>


<div className="card" onClick={() => toggleAttendanceData(classroom._id)}>
  <div className="card-content">
    <FontAwesomeIcon icon={faCalendarAlt} className="icon" />
    <h3 className={`attendance-text ${visibleAttendanceData[classroom._id] ? 'hidden' : ''}`}>
      {visibleAttendanceData[classroom._id] ? 'Hide Attendance Data' : 'Attendance Data'}
    </h3>
  </div>
</div>

<div className="card" onClick={() => toggleBlacklistVisibility(classroom._id)}>
  <div className="card-content">
    <FontAwesomeIcon icon={faBan} className="icon" />
    <h3 className={`blacklist-text ${blacklistVisibility[classroom._id] ? 'active' : ''}`}>
      {blacklistVisibility[classroom._id] ? 'Hide Blacklist Data' : 'Blacklist Data'}
    </h3>
  </div>
</div>



<div className="card" onClick={() => toggleMarksForm(classroom)}>
  <div className="card-content">
    <FontAwesomeIcon icon={faUpload} className="icon" />
    <h3 className={`marks-text ${marksFormVisibility?._id === classroom._id ? 'active' : ''}`}>
      {marksFormVisibility?._id === classroom._id ? 'Hide Update Marks' : 'Upload Marks'}
    </h3>
  </div>
</div>


<div className="card" onClick={() => toggletestmarks(classroom._id)}>
  <div className="card-content">
    <FontAwesomeIcon icon={faChartLine} className="icon" />
    <h3 className={`marks-text ${testmarksVisibility[classroom._id] ? 'active' : ''}`}>
      {testmarksVisibility[classroom._id] ? 'Hide Marks' : 'Show Marks'}
    </h3>
  </div>
</div>



<div className="card" onClick={() => toggleVideoForm(classroom)}>
  <div className="card-content">
    <FontAwesomeIcon icon={faVideo} className="icon" />
    <h3 className={`marks-text ${videoFormVisibility[classroom._id] ? 'active' : ''}`}>
      {videoFormVisibility[classroom._id] ? 'Hide Videos' : 'Upload Videos'}
    </h3>
  </div>
</div>



<div className="card" onClick={() => togglevideo(classroom._id)}>
  <div className="card-content">
    <FontAwesomeIcon icon={faPlayCircle} className="icon" />
    <h3 className={`toggle-text ${visibleVideo[classroom._id] ? 'active' : ''}`}>
      {visibleVideo[classroom._id] ? 'Hide Video' : 'Show Video'}
    </h3>
  </div>
</div>

<div className="card" onClick={() => toggleScheduleForm(classroom)}>
  <div className="card-content">
    <FontAwesomeIcon icon={faCalendarAlt} className="icon" />
    <h3 className={`toggle-text ${scheduleFormVisibility[classroom._id] ? 'active' : ''}`}>
      {scheduleFormVisibility[classroom._id] ? 'Hide Update Schedule' : 'Update Schedule'}
    </h3>
  </div>
</div>



<div className="card" onClick={() => toggleschedule(classroom._id)}>
  <div className="card-content">
    <FontAwesomeIcon icon={faCalendar} className="icon" />
    <h3 className={`toggle-text ${visibleSchedule[classroom._id] ? 'active' : ''}`}>
      {visibleSchedule[classroom._id] ? 'Hide Schedule' : 'Schedule'}
    </h3>
  </div>
</div>

<div className="card" onClick={() => toggleStudyMaterialForm(classroom)}>
  <div className="card-content">
    <FontAwesomeIcon icon={faUpload} className="icon" />
    <h3 className={`toggle-text ${studyMaterialFormVisibility[classroom._id] ? 'active' : ''}`}>
      {studyMaterialFormVisibility[classroom._id] ? 'Hide Upload' : 'Upload Notes'}
    </h3>
  </div>
</div>

<div className="card" onClick={() => togglestudymaterial(classroom._id)}>
  <div className="card-content">
    <FontAwesomeIcon icon={faBookOpen} className="icon" />
    <h3 className={`toggle-text ${visibleStudyMaterial[classroom._id] ? 'active' : ''}`}>
      {visibleStudyMaterial[classroom._id] ? 'Hide Notes' : 'Show Notes'}
    </h3>
  </div>
</div>

<div className="card" onClick={() => togglehwForm(classroom)}>
  <div className="card-content">
    <FontAwesomeIcon icon={faTasks} className="icon" />
    <h3 className={`toggle-text ${hwFormVisibility[classroom._id] ? 'active' : ''}`}>
      {hwFormVisibility[classroom._id] ? 'Hide Hw' : 'Assign Hw'}
    </h3>
  </div>
</div>


<div className="card" onClick={() => togglehw(classroom._id)}>
  <div className="card-content">
    <FontAwesomeIcon icon={faEye} className="icon" />
    <h3 className={`toggle-text ${visiblehw[classroom._id] ? 'active' : ''}`}>
      {visiblehw[classroom._id] ? 'Hide Hw' : 'View Hw'}
    </h3>
  </div>
</div>

<div className="card" onClick={() => togglestatusForm(classroom)}>
  <div className="card-content">
    <FontAwesomeIcon icon={faEdit} className="icon" />
    <h3 className={`toggle-text ${statusFormVisibility[classroom._id] ? 'active' : ''}`}>
      {statusFormVisibility[classroom._id] ? 'Hide Hw Status' : 'Update Hw Status'}
    </h3>
  </div>
</div>

<div className="card" onClick={() => toggleFormVisibility(classroom)}>
  <div className="card-content">
    <FontAwesomeIcon icon={faClipboardList} className="icon" />
    <h3 className={`toggle-text ${formVisibility[classroom._id] ? 'active' : ''}`}>
      {formVisibility[classroom._id] ? 'Hide Form' : 'Quick Form'}
    </h3>
  </div>
</div>

<div className="card" onClick={() => toggleform(classroom._id)}>
  <div className="card-content">
    <FontAwesomeIcon icon={faFileAlt} className="icon" />
    <h3 className={`toggle-text ${visibleForm[classroom._id] ? 'active' : ''}`}>
      {visibleForm[classroom._id] ? 'Hide Forms' : 'Forms'}
    </h3>
  </div>
</div>


<div className="card" onClick={() => togglemeetFormVisibility(classroom)}>
  <div className="card-content">
    <FontAwesomeIcon icon={faVideo} className="icon" />
    <h3 className={`toggle-text ${meetformVisibility[classroom._id] ? 'active' : ''}`}>
      {meetformVisibility[classroom._id] ? 'Hide Live Lecture' : 'Update Live Lecture'}
    </h3>
  </div>
</div>

<div className="card" onClick={() => togglemeetlink(classroom._id)}>
  <div className="card-content">
    <FontAwesomeIcon icon={faVideo} className="icon" />
    <h3 className={`toggle-text ${visiblemeetlink[classroom._id] ? 'active' : ''}`}>
      {visiblemeetlink[classroom._id] ? 'Hide Lecture' : 'Lecture Info'}
    </h3>
  </div>
</div>

<div className="card" onClick={() => toggleChatVisibility(classroom._id)}>
  <div className="card-content">
    <FontAwesomeIcon icon={faComments} className="icon" />
    <h3 className={`toggle-text ${chatVisibility[classroom._id] ? 'active' : ''}`}>
      {chatVisibility[classroom._id] ? 'Hide Chat' : 'Chat'}
    </h3>
  </div>
</div>

<div className="card" onClick={() => toggleemailForm(classroom)}>
  <div className="card-content">
    <FontAwesomeIcon icon={faEnvelopeOpenText} className="icon" />
    <h3 className={`toggle-text ${emailFormVisibility[classroom._id] ? 'active' : ''}`}>
      {emailFormVisibility[classroom._id] ? 'Hide Email' : 'Update Email'}
    </h3>
  </div>
</div>

<div className="card" onClick={() => toggleemail(classroom._id)}>
  <div className="card-content">
    <FontAwesomeIcon icon={faPaperPlane} className="icon" />
    <h3 className={`toggle-text ${visibleemail[classroom._id] ? 'active' : ''}`}>
      {visibleemail[classroom._id] ? 'Hide Notification' : 'Send Notification'}
    </h3>
  </div>
</div>

<div className="card" onClick={() => togglewhiteboardVisibility(classroom._id)}>
  <div className="card-content">
    <FontAwesomeIcon icon={faChalkboard} className="icon" />
    <h3 className={`toggle-text ${whiteboardVisibility[classroom._id] ? 'active' : ''}`}>
      {whiteboardVisibility[classroom._id] ? 'Hide Virtual Board' : 'Virtual Board'}
    </h3>
  </div>
</div>



{classroom && (
  <div className="new-line-content"> 
    <ClassroomStudents classroomId={classroom._id} />
  </div>
)}


 
</div>
  </div>
)}

                  
                  
                  
        
                </div>
               

                {blacklistVisibility[classroom._id] && (
                 <BlacklistData classroomId={classroom._id} />
                )}

                {/* Conditionally render AttendanceData based on visibility state */}
              {testmarksVisibility[classroom._id] && (
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

                {classroom._id && studentId && whiteboardVisibility[classroom._id] && (
                <Whiteboard classroomId={classroom._id} studentId={studentId} />
                )}

                {visibleemail[classroom._id] && (
                  <Emails classroomId={classroom._id} />
                )}

                
                {/* Faculty and Student Details */}
                {visibleFaculty[classroom._id] && facultyDetails[classroom._id] && (
                  <div className="facultyview-container">
                    <h3>Faculties</h3>
                    <ul type="square">
                      {facultyDetails[classroom._id].length === 0 ? (
                        <p>No faculty members assigned</p>
                      ) : (
                        facultyDetails[classroom._id].map((faculty) => (
                          <li key={faculty._id}   style={{marginTop: '10px'}}>{faculty.username}</li>
                        ))
                      )}
                    </ul>
                  </div>
                )}
                {visibleStudents[classroom._id] && studentDetails[classroom._id] && (
                  <div>
                    
                    
   <h3>Students</h3><ul type="square">
 {studentDetails[classroom._id].length === 0 ? (
   <p>No students enrolled</p>
 ) : (
   studentDetails[classroom._id].map((student) => (
    <li key={student._id}   style={{ marginTop: '10px', fontSize:'20px'}}>
      {student.username}
                           
     <button
    onClick={() => toggleStudentDetails(student._id)}
    className="view-details-btn-quick"
  >
    {studentDetailsVisibility[student._id] ? 'Hide Details' : 'View Details'}
  </button>
                             {/* Existing Buttons - Shown/Hidden Based on Visibility */}
  {studentDetailsVisibility[student._id] && (
    <>
      <button
  onClick={() => toggleStudentAttendance(student._id, classroom._id)}
  className={`action-btn attendance-btn ${attendanceVisibility[classroom._id]?.[student._id] ? 'hide-btn' : ''}`}
>
  {attendanceVisibility[classroom._id]?.[student._id] ? 'Hide Attendance' : 'Attendance'}
</button>

<button
  onClick={() => toggleBlacklistFormVisibility(student._id)}
  className={`action-btn blacklist-btn ${blacklistFormVisibility[student._id] ? 'hide-btn' : ''}`}
>
  {blacklistFormVisibility[student._id] ? 'Hide Blacklist' : 'Update Blacklist'}
</button>


<button
  onClick={() => toggleBlacklistVisibility(student._id)}
  className={`info-btn blacklist-info-btn ${blacklistVisibility[student._id] ? 'hide-btn' : ''}`}
>
  {blacklistVisibility[student._id] ? 'Hide Blacklist Info' : 'Blacklist Info'}
</button>

<button
  onClick={() => toggletestmarksVisibility(student._id)}
  className={`info-btn marks-info-btn ${testmarksVisibility[student._id] ? 'hide-btn' : ''}`}
>
  {testmarksVisibility[student._id] ? 'Hide Marks Info' : 'Marks Info'}
</button>

                
<button
  onClick={() => togglehw(student._id)}
  className={`action-btn hw-btn ${visiblehw[student._id] ? 'hide-btn' : ''}`}
>
  {visiblehw[student._id] ? 'Hide Hw' : 'Show Hw'}
</button>

<button
  onClick={() => toggleemail(student._id)}
  className={`action-btn notification-btn ${visibleemail[student._id] ? 'hide-btn' : ''}`}
>
  {visibleemail[student._id] ? 'Hide Notification' : 'Send Notification'}
</button>

    </>
  )}
                          


                 

                  {attendanceVisibility[classroom._id]?.[student._id] && (
                  <AttendanceData classroomId={classroom._id} studentId={student._id} />
                  )}

                  {blacklistFormVisibility[student._id] && (
                  <BlacklistForm classroomId={classroom._id} student={student}
                      closeForm={() => toggleBlacklistFormVisibility(student._id)}/>
                  )}

                  {blacklistVisibility[student._id] && (
                  <BlacklistData classroomId={classroom._id} studentId={student._id} />
                  )}

                  {testmarksVisibility[student._id] && (
                  <TestMarksData classroomId={classroom._id} studentId={student._id} />
                  )}

                  {visiblehw[student._id] && (
                  <HomeworkData classroomId={classroom._id} studentId={student._id} />
                  )}

                  {visibleemail[student._id] && (
                  <Emails classroomId={classroom._id} studentId={student._id} />
                   )}
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                )}

                {/* Display AttendanceForm directly below the specific classroom */}
                {selectedClassroom?._id === classroom._id && (
                  <AttendanceForm
                    classroom={selectedClassroom}
                    students={studentDetails[classroom._id] || []}
                    closeForm={() => setSelectedClassroom(null)}
                  />
                )}

                {/* Conditionally render AttendanceData based on visibility state */}
                {visibleAttendanceData[classroom._id] && (
                  <AttendanceData classroomId={classroom._id} />
                )}

                  {/* Display MarksUpdateForm if marksFormVisible is true for this classroom */}
          {marksFormVisibility?._id===classroom._id && (
            <MarksUpdateForm
              classroom={marksFormVisibility}
              students={studentDetails[classroom._id] || []}
              closeForm={() =>
                setMarksFormVisibility(null)
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
              students={studentDetails[classroom._id] || []}
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
              students={studentDetails[classroom._id] || []}
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
              students={studentDetails[classroom._id] || []}
              closeForm={() =>
                setemailFormVisibility((prevState) => ({
                  ...prevState,
                  [classroom._id]: false, // Close the Marks form for this classroom
                }))
              }
            />
          )}


            
              </div>
              <br />
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default FacultyDashboard;
