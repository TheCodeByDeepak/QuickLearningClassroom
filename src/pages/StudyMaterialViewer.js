import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faPlay, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import './CSS/StudyMaterialViewer.css'

const StudyMaterialViewer = ({ classroomId }) => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchStudyMaterials = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/study-material/view/${classroomId}`
        );
        setMaterials(response.data.files);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching study materials:', err);
        setError(err);
        setLoading(false);
      }
    };

    if (classroomId) {
      fetchStudyMaterials();
    }
  }, [classroomId]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDeleteMaterial = async (name, description) => {
    // Optimistically update the UI by immediately removing the material
    setMaterials((prevMaterials) =>
      prevMaterials.filter(
        (material) => !(material.name === name && material.description === description)
      )
    );
  
    try {
      const response = await axios.delete(
        'http://localhost:5000/api/study-material/deleteMaterial',
        {
          data: {
            classroomId,
            name,
            description,
          },
        }
      );
  
      console.log(response.data.message);
  
      // Set success message
      setSuccessMessage('Study Material deleted successfully!');
  
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting study material:', error);
  
      // Revert UI changes if the request fails
      setMaterials((prevMaterials) => [
        ...prevMaterials,
        { name, description },
      ]);
    }
  };
  
  
  const filteredMaterials = materials.filter(
    (material) =>
      material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (material.description &&
        material.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleViewPDF = (materialLink) => {
    const fileId = materialLink.split('/d/')[1]?.split('/')[0];
    const embedLink = `https://drive.google.com/file/d/${fileId}/preview`;
    setSelectedMaterial({ type: 'pdf', link: embedLink });
  };

  const handlePlayVideo = (materialLink) => {
    const fileId = materialLink.split('/d/')[1]?.split('/')[0];
    const videoUrl = `https://drive.google.com/file/d/${fileId}/preview`;
    setSelectedMaterial({ type: 'video', link: videoUrl });
  };

  const handleCloseMaterial = () => {
    setSelectedMaterial(null);
  };

  if (loading) return <p>Loading study materials...</p>;
  if (error) return <p>No study material found</p>;

  return (
    <div>
      <h3>Study Materials</h3>

      {/* Success message */}
      {successMessage && (
        <p style={{ color: 'green', fontWeight: 'bold' }}>
          {successMessage}
        </p>
      )}

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by Name or Description"
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
        <button
          onClick={() => setSearchTerm('')}
         className="clear-button"
        >
          Clear
        </button>
      </div>

      {/* Table displaying study materials */}
      <table className="study-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Preview</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredMaterials.length === 0 ? (
            <tr>
              <td colSpan="4">No study materials found for this classroom.</td>
            </tr>
          ) : (
            filteredMaterials.map((material, index) => (
              <tr key={index}>
                <td>{material.name}</td>
                <td>{material.description || 'No description available'}</td>
                <td>
                  {material.mimeType === 'application/pdf' ? (
                     <FontAwesomeIcon
                          icon={faFilePdf}
                          className="icon-button icon-pdf"
                          onClick={() => handleViewPDF(material.webViewLink)}
                          title="View PDF"
                        />
                  ) : material.mimeType.includes('video') ? (
                   <FontAwesomeIcon
                         icon={faPlay}
                         className="icon-button icon-play"
                         onClick={() => handlePlayVideo(material.webViewLink)}
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
                </td>
                <td>
                <button
              onClick={() => handleDeleteMaterial(material.name, material.description)}
              style={{
              color: 'red',
              fontSize: '24px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
             }}
           >
            <FaTrash />
          </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Show PDF inline */}
      {selectedMaterial && selectedMaterial.type === 'pdf' && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: '20px',
            borderRadius: '10px',
            width: '80%',
            maxWidth: '600px',
            zIndex: 1000,
            overflow: 'auto',
            height: '80%',
          }}
        >
          <button
            onClick={handleCloseMaterial}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              backgroundColor: 'red',
              color: 'white',
              border: 'none',
              padding: '10px',
              borderRadius: '50%',
              cursor: 'pointer',
            }}
          >
            X
          </button>
          <iframe
            width="100%"
            height="620"
            src={selectedMaterial.link}
            title="PDF Viewer"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
      )}

      {/* Play Video inline */}
      {selectedMaterial && selectedMaterial.type === 'video' && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: '20px',
            borderRadius: '10px',
            width: '80%',
            maxWidth: '600px',
            zIndex: 1000,
            overflow: 'auto',
            height: '80%',
          }}
        >
          <button
            onClick={handleCloseMaterial}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              backgroundColor: 'red',
              color: 'white',
              border: 'none',
              padding: '10px',
              borderRadius: '50%',
              cursor: 'pointer',
            }}
          >
            X
          </button>
          <iframe
            width="100%"
            height="100%"
            src={selectedMaterial.link}
            title="Video Player"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default StudyMaterialViewer;
