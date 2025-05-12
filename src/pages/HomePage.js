import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../pages/images/homepage.png';
import './CSS/HomePage.css';
import ChatBot from './ChatBot';

const HomePage = () => {
  const [showHomeContent, setShowHomeContent] = useState(true);
  const [text, setText] = useState('');
  const [showFeatures, setShowFeatures] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [showContact, setShowContact] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  const tagline = "Your Classroom, Reimagined with Technology.";
  const aboutUsText = [
    "Quick Learning Classroom is where education meets innovation",
    "with smart technology, interactive sessions, and expert guidance.",
    "We make learning faster, easier, and more effective -",
    "anytime, anywhere."
  ];

  const galleryImages = [
    require('../pages/images/student.png'),
    require('../pages/images/faculty.png'),
    require('../pages/images/admin.png'),
    require('../pages/images/admin2.png'),
    require('../pages/images/admin3.png'),
  ];

  useEffect(() => {
    if (showHomeContent) {
      setText('');
      let index = 0;
      const interval = setInterval(() => {
        setText(tagline.substring(0, index + 1));
        index++;
        if (index === tagline.length) clearInterval(interval);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [showHomeContent]);

  useEffect(() => {
    if (showGallery) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % galleryImages.length);
      }, 3000); // Change image every 3 seconds
      return () => clearInterval(interval);
    }
  }, [showGallery]);

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: 'white',
        textAlign: 'center',
      }}
    >
      {/* Navigation Bar */}
      <nav className="navbar">
        <ul>
          <li><a href="#" onClick={() => { setShowHomeContent(true); setSelectedFeature(null); setShowContact(false); setShowGallery(false); }}>Home</a></li>
          <li><a href="#" onClick={() => { setShowHomeContent(false); setSelectedFeature(null); setShowContact(false); setShowGallery(false); }}>About Us</a></li>
          <li 
            className="dropdown"
            onMouseEnter={() => setShowFeatures(true)}
            onMouseLeave={() => setShowFeatures(false)}
          >
            <a href="#">Features</a>
            {showFeatures && (
              <ul className="dropdown-menu">
                <li><a href="#" onClick={() => { setSelectedFeature('admin'); setShowContact(false); setShowGallery(false); }}>Admin</a></li>
                <li><a href="#" onClick={() => { setSelectedFeature('faculty'); setShowContact(false); setShowGallery(false); }}>Faculty</a></li>
                <li><a href="#" onClick={() => { setSelectedFeature('student'); setShowContact(false); setShowGallery(false); }}>Students</a></li>
              </ul>
            )}
          </li>
          <li><a href="#" onClick={() => { setShowHomeContent(false); setSelectedFeature(null); setShowContact(false); setShowGallery(true); }}>Gallery</a></li>
          <li><a href="#" onClick={() => { setShowHomeContent(false); setSelectedFeature(null); setShowContact(true); setShowGallery(false); }}>Contact</a></li>
        </ul>
        <div className="buttons">
          <button className="join-btn" onClick={() => navigate('/register')}>Join Us</button>
          <button className="signup-btn" onClick={() => navigate('/login')}>Sign Up</button>
        </div>
        
      </nav>

      {/* Centered Content */}
      <div className="content">
        {selectedFeature === 'admin' ? (
          <>
            <h1 className="admin-title">Admin Features</h1>
            <div className="admin-details">
              <p>User Management – Manage students and faculty roles.</p>
              <p>Course Control – Create, update, and oversee courses.</p>
              <p>Performance Tracking – Monitor student and faculty progress.</p>
              <p>Announcements – Send important updates and alerts.</p>
              <p>Secure Access – Ensure authorized system usage.</p>
              <p>Reports & Analytics – Generate insights on learning and performance.</p>
            </div>
          </>
        ) : selectedFeature === 'faculty' ? (
          <>
            <h1 className="faculty-title">Faculty Features</h1>
            <div className="faculty-details">
              <p>Course Management – Create, update, and organize study materials.</p>
              <p>Live & Recorded Classes – Conduct interactive sessions for students.</p>
              <p>Student Progress Tracking – Monitor individual and batch performance.</p>
              <p>Assignments & Exams – Create, assign, and evaluate tests.</p>
              <p>Discussion & Q&A – Engage with students through forums.</p>
            </div>
          </>
        ) : selectedFeature === 'student' ? (
          <>
            <h1 className="student-title">Student Features</h1>
            <div className="student-details">
              <p>Course Enrollment – Join and access assigned courses easily.</p>
              <p>Live & Recorded Classes – Learn anytime with flexible access.</p>
              <p>Assignments & Exams – Submit tasks and take online tests.</p>
              <p>Performance Tracking – View progress reports and analytics.</p>
              <p>Discussion & Q&A – Interact with faculty and peers.</p>
              <p>24/7 Chatbot Support – Get instant answers to queries.</p>
              <p>Feedback & Mentorship – Guide students with personalized support.</p>
            </div>
          </>
        ) : showContact ? (
          <>
            <h1 className="contact-title">Contact Us</h1>
            <div className="contact-buttons">
              <a href="mailto:quick9359learning@gmail.com" className="contact-btn email-btn">📧 Email Us</a>
              <a href="tel:+919359717732" className="contact-btn call-btn">📞 Call Us</a>
            </div>
          </>
        ) : showGallery ? (
          <>
            <h1 className="gallery-title">Gallery</h1>
            <div className="gallery-container">
              
              <img 
                src={galleryImages[currentImageIndex]} 
                alt="Gallery Slide" 
                className="gallery-image"
              />
            </div>
          </>
        ) : showHomeContent ? (
          <>
            <h1 className="brand-title">Quick Learning Classroom</h1>
            <p className="tagline">{text}</p>
            <ChatBot />
          </>
        ) : (
          <>
            <h1 className="about-us">About Us</h1>
            <div className="about-text">
              {aboutUsText.map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          </>
        )}
        
      </div>
    </div>
  );
};

export default HomePage;
