import React, { useState } from 'react';
import axios from 'axios'; // Make sure you have axios installed
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './CSS/RegisterPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEnvelope, faUserPlus, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        username,
        password,
        email,
      });
      alert(response.data.message); // Notify the user of registration success
      navigate('/login'); // Redirect to login page after successful registration
    } catch (err) {
      setError('Registration failed. Please try again.'); // Handle registration error
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login'); // Navigate to login page
  };

  return (
    <div className="register-container">
      <h1 className="register-header">
        <FontAwesomeIcon icon={faUserPlus} className="header-icon" /> Register
      </h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleRegister} className="register-form">
        <div className="form-group">
          <label className="form-label">
            <FontAwesomeIcon icon={faUser} className="form-icon" /> Username:
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label className="form-label">
            <FontAwesomeIcon icon={faLock} className="form-icon" /> Password:
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label className="form-label">
            <FontAwesomeIcon icon={faEnvelope} className="form-icon" /> Email:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <button type="submit" className="register-button">
          <FontAwesomeIcon icon={faPaperPlane} className="button-icon" /> Register</button>
      </form>

      {/* Already Registered Link */}
      <div className="login-link-container">
        <p>Already registered? <span onClick={handleLoginRedirect} className="login-link">Login</span></p>
      </div>
    </div>
  );
};

export default RegisterPage;
