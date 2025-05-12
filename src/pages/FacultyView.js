import React from 'react';
import './CSS/FacultyView.css'

const FacultyView = ({ faculties, onRemoveFaculty }) => {
  return (
    <div className='faculty-container-admin'>
      <h3>Faculty:</h3>
      {faculties.length === 0 ? (
        <p>No faculty in this classroom.</p>
      ) : (
        <ul type='square'>
          {faculties.map((faculty) => (
            <li key={faculty._id}>
              {faculty.username} {/* Display the username */} 
              <button onClick={() => onRemoveFaculty(faculty._id)} className="remove-btn-faculty-admin">Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FacultyView;
