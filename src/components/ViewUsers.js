import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';

const ViewUsers = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Initialize navigation

    const fetchUserById = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:5000/api/users/profile/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(response.data);
            setError('');
        } catch (err) {
            setError('User not found or error fetching user.');
            setUser(null);
        }
    };

    useEffect(() => {
        const studentId = localStorage.getItem('studentId');
        if (studentId) {
            fetchUserById(studentId);
        } else {
            setError('Student ID not found in local storage.');
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove token
        localStorage.removeItem('studentId'); // Remove student ID
        navigate('/'); // Redirect to home page
    };

    const getProfileHeading = (role) => {
        switch (role) {
            case 'student':
                return 'Student Profile';
            case 'faculty':
                return 'Faculty Profile';
            case 'admin':
                return 'Admin Profile';
            default:
                return 'User Profile';
        }
    };

    return (
        <div>
            {user ? (
                <div
                    style={{
                        position: 'absolute',
                        top: '90px',
                        right: '10px',
                        padding: '10px',
                        backgroundColor: 'white',
                        border: '1px solid #ccc',
                        borderRadius: '5px',
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                        width: '250px',
                    }}
                >
                    <h2>{getProfileHeading(user.role)}</h2>
                    <div>
                        <p><strong>Username:</strong> {user.username}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Role:</strong> {user.role}</p>
                    </div>
                    <button 
                        onClick={handleLogout} 
                        style={{
                            marginTop: '5px',
                            width: '100%',
                            padding: '8px',
                            backgroundColor: 'tomato',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        Logout
                    </button>
                </div>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : null}
        </div>
    );
};

export default ViewUsers;
