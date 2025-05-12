import React from 'react';
import './CSS/StudentView.css'

const StudentView = ({ students = [], onRemoveStudent }) => {
  return (
    <div className="students-container-admin">
      <h3>Students:</h3>
      {students.length === 0 ? (
        <p>No students in this classroom.</p>
      ) : (
        <ul type='square'>
          {students.map((student) => (
            <li key={student._id}>
              {student.username}
              <button 
                onClick={() => onRemoveStudent(student._id)}
                className="remove-btn-quick-admin"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StudentView;
