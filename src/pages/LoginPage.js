import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CSS/LoginPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faChalkboardTeacher, faGraduationCap } from '@fortawesome/free-solid-svg-icons';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      const { token, role, studentId } = response.data;
      
      // Store token, role, and userId in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('studentId', studentId); // Store the userId

      // Redirect based on role
      if (role === 'admin') {
        navigate('/admin-dashboard');
      } else if (role === 'faculty') {
        navigate('/faculty-dashboard');
      } else {
        navigate('/student-dashboard');
      }
    } catch (error) {
      alert('Invalid credentials');
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  const handleForgotPassword = () => {
    setForgotPasswordMessage('Please contact the admin for password recovery.');
    // Hide the message after 3 seconds
    setTimeout(() => {
      setForgotPasswordMessage('');
    }, 5000);
  };

  return (
    <div className="login-container">
      <h1>
        <FontAwesomeIcon icon={faGraduationCap} className="title-icon" /> Login
      </h1>
      <form onSubmit={handleLogin} className="login-form">
        {/* Username Field */}
        <div className="form-group">
          <label className="form-label">
            <FontAwesomeIcon icon={faUser} className="form-icon" /> Username:
          </label>
          <input
            className="form-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        {/* Password Field */}
        <div className="form-group">
          <label className="form-label">
            <FontAwesomeIcon icon={faLock} className="form-icon" /> Password:
          </label>
          <input
            className="form-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {/* Submit Button */}
        <button type="submit" className="login-button">
          <FontAwesomeIcon icon={faChalkboardTeacher} className="button-icon" /> Login
        </button>
      </form>

      {/* Forgot Password and Register Link */}
      <div className="login-options">
        <a href="#!" onClick={handleForgotPassword} className="login-link">Forgot Password?</a>
        <p>Don't have an account? <span onClick={handleRegisterRedirect} className="register-link">Register</span></p>
      </div>

      {/* Forgot Password Message */}
      {forgotPasswordMessage && (
        <div className="forgot-password-message">{forgotPasswordMessage}</div>
      )}
    </div>
  );
};

export default LoginPage;
