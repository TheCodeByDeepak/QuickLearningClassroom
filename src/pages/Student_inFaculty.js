// ClassroomStudents.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGraduate} from '@fortawesome/free-solid-svg-icons';
import './CSS/Student_inFaculty.css'

const ClassroomStudents = ({ classroomId }) => {
  const [students, setStudents] = useState([]);
  const [visibleError, setVisibleError] = useState('');
  const [studentsVisible, setStudentsVisible] = useState(false); // New state for toggling student list visibility

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
      } catch (err) {
        setVisibleError(err.response?.data?.message || 'Failed to fetch students');
      }
    };

    fetchStudents();
  }, [classroomId]);

  
 const toggleStudentsVisibility = () => {
    setStudentsVisible((prev) => !prev);
  };

  return (
    <div>
     
      {visibleError && <p style={{ color: 'red' }}>{visibleError}</p>}
      <div>
      <div className="card" onClick={toggleStudentsVisibility}>
  <div className="card-content">
    <FontAwesomeIcon icon={faUserGraduate} className="icon" />
    <h3 className={`toggle-text ${studentsVisible ? 'active' : ''}`}>
      {studentsVisible ? 'Hide Student' : 'Show Student'}
    </h3>
  </div>
</div>



      </div>
      {studentsVisible && (
       <div className="students-container">
       <h3>Students</h3>
       <ul>
         {students.length === 0 ? (
           <p>No students in this classroom.</p>
         ) : (
           students.map((student) => (
             <li key={student._id}>
               {student.username}
             </li>
           ))
         )}
       </ul>
     </div>
     
      )}
    </div>
  );
};

export default ClassroomStudents;
