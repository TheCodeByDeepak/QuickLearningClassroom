import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreateClassroom from './CreateClassroom';
import ExistingClassrooms from './ExistingClassrooms';
import UpdateUserRole from '../components/UpdateUserRole'; // Ensure this path is correct
import ViewUsers from './ViewUsers';
import ExpenseForm from './ExpenseForm'; 
import ExpenseData from './ExpenseData';
import ViewClassrooms from '../components/ViewClassrooms';
import UpdateClassroomDetails from '../components/UpdateClassroomDetails';
import ViewUser from '../components/ViewUsers';
import './CSS/AdminDashboard.css'
import { FaUser } from 'react-icons/fa';

const AdminDashboard = () => {
  const [classrooms, setClassrooms] = useState([]);
  const studentId = localStorage.getItem('studentId');
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showCreateClassroom, setShowCreateClassroom] = useState(false);
  const [showExistingClassrooms, setShowExistingClassrooms] = useState(false);
  const [showUpdateUserRole, setShowUpdateUserRole] = useState(false);
  const [showViewUsers, setShowViewUsers] = useState(false); // New state for toggling ViewUsers visibility
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showExpenseData, setShowExpenseData] = useState(false);
  const [showViewClassroom, setShowViewClassroom] = useState(false);
  const [showUpdateClassroom, setShowUpdateClassroom] = useState(false);
  const [userVisibility, setuserVisibility] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchClassrooms();
        await fetchFaculties();
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchClassrooms = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:5000/api/classrooms', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setClassrooms(response.data);
  };

  const fetchFaculties = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:5000/api/users/faculties', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setFaculties(response.data);
  };

  const toggleCreateClassroom = () => {
    setShowCreateClassroom((prev) => !prev);
  };

  const toggleExistingClassrooms = () => {
    setShowExistingClassrooms((prev) => !prev);
  };

  // New function to toggle UpdateUserRole visibility
  const toggleUpdateUserRole = () => {
    setShowUpdateUserRole((prev) => !prev);
  };

  // New function to toggle ViewUsers visibility
  const toggleViewUsers = () => {
    setShowViewUsers((prev) => !prev);
  };

  const toggleExpenseForm = () => {
    setShowExpenseForm((prev) => !prev); // Toggle ExpenseForm visibility
  };

  const toggleExpenseData = () => {
    setShowExpenseData((prev) => !prev);
  };

  const toggleViewClssroom = () => {
    setShowViewClassroom((prev) => !prev);
  };

  const toggleUpdateClassroom = () => {
    setShowUpdateClassroom((prev) => !prev);
  };

  const toggleuserVisibility = (studentId) => {
    setuserVisibility((prev) => ({
      ...prev,
      [studentId]: !prev[studentId], // Toggle visibility based on studentId
    }));
  };

  return (
    <div className="admin-page">
      <h1 class="dashboard-heading-admin">Admin Dashboard</h1>
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
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ marginBottom: '20px' }} className='button-container'>
        <button onClick={toggleCreateClassroom} className="main-button">
          {showCreateClassroom ? 'Hide Create Classroom' : 'Create Classroom'}
        </button>
        <button onClick={toggleExistingClassrooms} className="main-button">
          {showExistingClassrooms ? 'Hide Existing Classrooms' : 'Existing Classrooms'}
        </button>
        <button onClick={toggleViewUsers} className="main-button">
          {showViewUsers ? 'Hide Users' : 'Users Info'}
        </button>
        <button onClick={toggleUpdateUserRole} className="main-button">
          {showUpdateUserRole ? 'Hide Update User Details' : 'Update User Details'}
        </button>
        <button onClick={toggleViewClssroom} className="main-button">
          {showViewClassroom ? 'Hide Classroom' : 'Classroom Info'}
        </button>
        <button onClick={toggleUpdateClassroom} className="main-button">
          {showUpdateClassroom ? 'Hide Update Classroom Details' : 'Update Classroom Details'}
        </button>
        <button onClick={toggleExpenseForm} className="main-button">
          {showExpenseForm ? 'Hide Expense Form' : 'Expense Form'}
        </button>
        <button onClick={toggleExpenseData} className="main-button">
          {showExpenseData ? 'Hide Expense Data' : 'Expense Data'}
        </button>
      </div>

      {/* Conditionally render the UpdateUserRole component based on showUpdateUserRole */}
      {showUpdateUserRole && <UpdateUserRole />}
      {/* Conditionally render the ViewUsers component based on showViewUsers */}
      {showViewUsers && <ViewUsers />}

      {showViewClassroom && <ViewClassrooms />}

      {showUpdateClassroom && <UpdateClassroomDetails />}

      {showCreateClassroom && (
        <CreateClassroom 
          faculties={faculties} 
          setMessage={setMessage} 
          setError={setError} 
          fetchClassrooms={fetchClassrooms} 
        />
      )}

      {showExistingClassrooms && (
        <ExistingClassrooms 
          classrooms={classrooms} 
          setMessage={setMessage} 
          setError={setError} 
        />
      )}

      {showExpenseForm && (
        <ExpenseForm 
          closeForm={() => setShowExpenseForm(false)} 
        />
      )}

      {showExpenseData && 
      <ExpenseData />} {/* Render ExpenseData component */}


      {loading && <p>Loading...</p>}
    </div>
  );
};

export default AdminDashboard;
