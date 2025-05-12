import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import '../CSS/StudyMaterialViewerStudent.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faPlay, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';


const StudyMaterialViewer = ({ classroomId }) => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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

  {/* Search Bar */}
  <div className="search-container">
    <input
      type="text"
      className="search-input"
      placeholder="Search by Name or Description"
      value={searchTerm}
      onChange={handleSearchChange}
    />
    <button
      className="clear-button"
      onClick={() => setSearchTerm('')}
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
    </tr>
  </thead>
  <tbody>
    {filteredMaterials.length === 0 ? (
      <tr>
        <td colSpan="3">No study materials found for this classroom.</td>
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
            width: '80%',   // Set width as 80% of screen width, same as PDF modal
            maxWidth: '600px',   // Maximum width to prevent overflow
            zIndex: 1000,
            overflow: 'auto',   // Prevent scrolling outside the iframe
            height: '80%',   // Set height to 80% to match the PDF viewer size
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
            width="100%"   // Make iframe width 100% of the container
            height="100%"   // Make iframe height 100% of the container
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
