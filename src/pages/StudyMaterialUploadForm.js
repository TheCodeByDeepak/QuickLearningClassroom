import React, { useState } from 'react';
import axios from 'axios';
import './CSS/StudyMaterialUploadForm.css'

const StudyMaterialUploadForm = ({ classroom, closeForm }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const submitStudyMaterial = async () => {
    if (!selectedFile) {
      alert('Please select a file.');
      return;
    }

    if (!description.trim()) {
      alert('Description is required.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('description', description);
    formData.append('classroomId', classroom._id); // Send classroom ID with the file

    try {
      setLoading(true); // Show loading state
      const response = await axios.post('http://localhost:5000/api/study-material/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        alert('Study material uploaded successfully');
        closeForm();
      } else {
        alert('Failed to upload study material');
      }
    } catch (err) {
      console.error('Error during upload:', err);

      // Log error details for debugging
      if (err.response) {
        // Response error from the server
        console.error('Error response:', err.response);
        alert(`Error: ${err.response.data.message || 'Failed to upload study material'}`);
      } else if (err.request) {
        // No response received from the server
        console.error('Error request:', err.request);
        alert('No response received from the server. Please try again later.');
      } else {
        // General error in setting up the request
        console.error('Error message:', err.message);
        alert('An error occurred while uploading the study material. Please try again later.');
      }
    } finally {
      setLoading(false); // Hide loading state after operation is complete
    }
  };

  const clearForm = () => {
    setSelectedFile(null);
    setDescription('');
  };

  return (
    <div  className='notes-container'>
      <h3 className="title">Upload Study Material for {classroom.name}</h3>

      <div style={{ marginBottom: '15px' }}>
      <label className="custom-file-label">
      Choose File
          <input
            type="file"
            onChange={handleFileChange}
             className="custom-file-input"
          />
        </label>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label className="notes-label">
          Description:
          <textarea
            value={description}
            onChange={handleDescriptionChange}
           className="notes-input"
          />
        </label>
      </div>

      <div style={{ textAlign: 'left' }}>
        <button
          onClick={submitStudyMaterial}
          disabled={loading} // Disable button while loading
         className='notes-submit'
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>

        <button
          onClick={clearForm}
          className='notes-clear'
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default StudyMaterialUploadForm;
