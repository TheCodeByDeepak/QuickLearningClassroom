import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';
import './CSS/HomeworkViewer.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faPlay, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

const HomeworkViewer = ({ classroomId, studentId }) => {
  const [homework, setHomework] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchHomework = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/student/homework/view/${classroomId}/${studentId}`
        );

        if (response.data && Array.isArray(response.data.files)) {
          setHomework(response.data.files);
        } else {
          setHomework([]);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching homework:', err);
        setError(err);
        setLoading(false);
      }
    };

    if (classroomId && studentId) {
      fetchHomework();
    }
  }, [classroomId, studentId]);

  const filteredHomework = homework.filter(
    (material) =>
      material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (material.description &&
        material.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleMaterialAction = (materialLink, type) => {
    const fileId = materialLink.split('/d/')[1]?.split('/')[0];
    const link = `https://drive.google.com/file/d/${fileId}/preview`;
    setSelectedMaterial({ type, link });
  };

  const handleCloseMaterial = () => setSelectedMaterial(null);

  const handleDeleteMaterial = async (name, description) => {
    // Optimistically update the UI
    setHomework((prevHomework) =>
      prevHomework.filter(
        (material) =>
          !(material.name === name && material.description === description)
      )
    );

    try {
      const response = await axios.delete(
        'http://localhost:5000/api/student/homework/delete',
        {
          data: { classroomId, studentId, name, description },
        }
      );
      console.log(response.data.message);

      // Set success message
      setSuccessMessage('Material deleted successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting material:', error);

      // Revert UI changes if the request fails
      setHomework((prevHomework) => [
        ...prevHomework,
        { name, description },
      ]);
    }
  };

  if (loading) return <p>Loading homework...</p>;
  if (error) return <p>No Homework Found.</p>;

  return (
    <div>
      <h3>Homework</h3>

      {/* Success Message */}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

      {/* Search Bar */}
      <div className="search-container">
  <input
    type="text"
    placeholder="Search by Name or Description"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="search-input"
  />
  <button onClick={() => setSearchTerm('')} className="clear-button">
    Clear
  </button>
</div>


      {/* Homework Table */}
      <table className="HWview-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredHomework.length > 0 ? (
            filteredHomework.map((material, index) => (
              <tr key={index}>
                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{material.name}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                  {material.description || 'No description available'}
                </td>
                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                  {material.mimeType === 'application/pdf' ? (
                     <FontAwesomeIcon
                          icon={faFilePdf}
                          className="icon-button icon-pdf"
                          onClick={() => handleMaterialAction(material.webViewLink)}
                          title="View PDF"
                        />
                  ) : material.mimeType.includes('video') ? (
                    <FontAwesomeIcon
                          icon={faPlay}
                          className="icon-button icon-play"
                          onClick={() => handleMaterialAction(material.webViewLink)}
                          title="Play Video"
                        />
                  ) : (
                     <a
                          href={material.webViewLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="icon-button icon-external-link"
                          title="Open"
                        >
                          <FontAwesomeIcon icon={faExternalLinkAlt} />
                        </a>
                  )}
                  <button
                    onClick={() => handleDeleteMaterial(material.name, material.description)}
                    style={{
                    color: 'red',
                    fontSize: '24px',
                   border: 'none',
                   background: 'none',
                   cursor: 'pointer',
                   marginLeft:'15px',
                  

                  }}
                >
                 <FaTrash />
                </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: 'center', padding: '10px' }}>
                No homework found for this student in this classroom.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Preview Section */}
      {selectedMaterial && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: '20px',
            borderRadius: '10px',
            zIndex: 1000,
            width: '80%',
            height: '80%',
          }}
        >
          <button
            onClick={handleCloseMaterial}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              backgroundColor: '#f00',
              color: '#fff',
              border: 'none',
              padding: '10px',
              borderRadius: '50%',
              cursor: 'pointer',
            }}
          >
            X
          </button>
          <iframe
            src={selectedMaterial.link}
            title="Material Viewer"
            frameBorder="0"
            style={{ width: '100%', height: '100%' }}
            allowFullScreen
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default HomeworkViewer;
