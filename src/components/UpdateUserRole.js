import React, { useState } from 'react';
import axios from 'axios';
import '../pages/CSS/UpdateUserRole.css'

const UpdateUserDetails = () => {
  const [userId, setUserId] = useState('');
  const [role, setRole] = useState('student');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [action, setAction] = useState('update'); // new state for action selection

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'userId') setUserId(value);
    else if (name === 'username') setUsername(value);
    else if (name === 'email') setEmail(value);
    else if (name === 'password') setPassword(value);
  };

  const handleUpdateDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      await axios.put(
        'http://localhost:5000/api/classrooms/updateRole',
        { userId, role, username, email, password },
        config
      );

      alert('User details updated successfully');
      resetForm();
    } catch (error) {
      console.error('Error response:', error.response);
      alert('Error updating user details: ' + (error.response?.data || 'Unknown error'));
    }
  };

  const handleDeleteUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      await axios.delete(`http://localhost:5000/api/classrooms/deleteUser/${userId}`, config);

      alert('User deleted successfully');
      resetForm();
    } catch (error) {
      console.error('Error response:', error.response);
      alert('Error deleting user: ' + (error.response?.data || 'Unknown error'));
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUserId(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    } catch (error) {
      console.error('Failed to read clipboard contents: ', error);
    }
  };

  const resetForm = () => {
    setUserId('');
    setRole('student');
    setUsername('');
    setEmail('');
    setPassword('');
    setAction('update');
  };

  const handleAction = () => {
    if (action === 'update') {
      handleUpdateDetails();
    } else if (action === 'delete') {
      handleDeleteUser();
    }
  };

  return (
    <div className='updateuser-container'>
      <h2  className="updateuser-title">Update or Delete User Details</h2>
      <p><strong>Note: </strong>Use the <mark>User ID</mark> to re-update or delete the Existing User </p>
      <div>
        <label htmlFor="userIdInput" className="updateuser-label">Enter User ID: </label><br />
        <input
          id="userIdInput"
          name="userId"
          type="text"
          value={userId}
          onChange={handleInputChange}
          placeholder="Enter user ID"
           className="updateuser-input"
        />
        <button onClick={handlePaste} className="updateuser-paste">
          Paste ID
        </button>
        {isCopied && <span style={{ color: 'green', marginLeft: '10px' }}>Pasted!</span>}
      </div>

      <div style={{ marginTop: '12px' }}>
        <label htmlFor="usernameInput" className="updateuser-label">Username: </label><br />
        <input
          id="usernameInput"
          name="username"
          type="text"
          value={username}
          onChange={handleInputChange}
          placeholder="Enter username"
          className="updateuser-input"
        />
      </div>

      <div style={{ marginTop: '12px' }}>
        <label htmlFor="emailInput" className="updateuser-label">Email: </label><br />
        <input
          id="emailInput"
          name="email"
          type="email"
          value={email}
          onChange={handleInputChange}
          placeholder="Enter email"
          className="updateuser-input"
        />
      </div>

      <div style={{ marginTop: '12px' }}>
        <label htmlFor="passwordInput" className="updateuser-label">Password: </label><br />
        <input
          id="passwordInput"
          name="password"
          type="password"
          value={password}
          onChange={handleInputChange}
          placeholder="Enter new password"
          className="updateuser-input"
        />
      </div>

      <div style={{ marginTop: '12px' }}>
        <label htmlFor="roleSelect" className="updateuser-label">Role: </label><br />
        <select
          id="roleSelect"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="updateuser-select"
        >
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div style={{ marginTop: '12px' }}>
        <label htmlFor="actionSelect" className="updateuser-label">Action: </label><br />
        <select
          id="actionSelect"
          value={action}
          onChange={(e) => setAction(e.target.value)}
          className="updateuser-select"
        >
          <option value="update">Update</option>
          <option value="delete">Delete</option>
        </select>
      </div>

      <div style={{ marginTop: '12px' }}>
        <button onClick={handleAction} className="updateuser-submit">
          {action === 'update' ? 'Update Details' : 'Delete User'}
        </button>
      </div>
    </div>
  );
};

export default UpdateUserDetails;
