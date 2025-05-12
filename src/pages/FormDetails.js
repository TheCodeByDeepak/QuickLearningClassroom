import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFileAlt, FaTrash } from 'react-icons/fa'; // Document and Trash icons
import './CSS/FormDetails.css'

const FormDetails = ({ classroomId }) => {
  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const [selectedFormLink, setSelectedFormLink] = useState(null); // State for selected form link
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/forms/getFormLinksByClassroomId?classroomId=${classroomId}`
        );
        setFormData(response.data); // Assuming form data is stored in state
        setLoading(false); // Set loading to false after data is fetched
      } catch (err) {
        console.error("Error fetching form data:", err);
        setLoading(false); // Set loading to false if there's an error
        setError('Failed to load form data');
      }
    };

    if (classroomId) {
      fetchFormData();
    }
  }, [classroomId]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredForms = formData.filter(
    (form) =>
      form.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewForm = (formLink) => {
    setSelectedFormLink(formLink); // Set selected form to display in iframe
  };

  const handleCloseForm = () => {
    setSelectedFormLink(null); // Close the form by setting selectedFormLink to null
  };

  const handleDeleteForm = async (date, formLink) => {
    // Optimistically update the UI by immediately removing the form
    setFormData((prevForms) =>
      prevForms.filter(
        (form) => !(form.date === date && form.formLink === formLink)
      )
    );

    try {
      const response = await axios.delete(
        'http://localhost:5000/api/forms/deleteForm',
        {
          data: {
            classroomId,
            date,
            formLink,
          },
        }
      );
      console.log(response.data.message);

      // Set success message
      setSuccessMessage('Form deleted successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting form:', error);

      // Revert UI changes if the request fails
      setFormData((prevForms) => [
        ...prevForms,
        { date, formLink },
      ]);
    }
  };

  if (loading) return <p>Loading form data...</p>;
  if (error) return <p>No form details found for this classroom.</p>;

  return (
    <div>
      <h3>Form Details</h3>

      {/* Success message */}
      {successMessage && (
        <p style={{ color: 'green', fontWeight: 'bold' }}>
          {successMessage}
        </p>
      )}

      {/* Search Bar with Clear Button */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by Topic or Description"
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

      {/* Table displaying form details */}
      <table
       className="form-table"
      >
        <thead>
          <tr>
            <th>Date</th>
            <th>Topic</th>
            <th>Description</th>
            <th>Form</th>
            <th>Delete</th> {/* Add a delete column */}
          </tr>
        </thead>
        <tbody>
          {filteredForms.length === 0 ? (
            <tr>
              <td colSpan="5">No form details found for this classroom.</td>
            </tr>
          ) : (
            filteredForms.map((form, index) => (
              <tr key={index}>
                <td>{form.date}</td>
                <td>{form.topic}</td>
                <td>{form.description}</td>
                <td>
                  <button
                    onClick={() => handleViewForm(form.formLink)}
                     className="view-form-button"
                  >
                    <FaFileAlt style={{ fontSize: '30px' }} />
                  </button>
                </td>
                <td>
                  <button
                    onClick={() =>
                      handleDeleteForm(form.date, form.formLink)
                    }
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

      {/* Display the selected form inside an iframe */}
      {selectedFormLink && (
        <div
          style={{
            position: 'fixed', // Fix the form in place
            top: '0', // Position at the top of the screen
            left: '0', // Position at the left of the screen
            width: '100%', // Full width
            height: '100%', // Full height to cover the screen
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background overlay
            zIndex: '9999', // Ensure it is above other content
            display: 'flex',
            justifyContent: 'center', // Center the iframe
            alignItems: 'center', // Center the iframe vertically
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              width: '80%', // Adjust the width
              maxWidth: '800px', // Maximum width for the form container
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
              position: 'relative',
            }}
          >
            <button
              onClick={handleCloseForm}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                backgroundColor: 'red',
                color: 'white',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '50%',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '16px',
              }}
            >
              X
            </button>
            <h4>Form Preview:</h4>
            <iframe
              src={selectedFormLink}
              width="100%" // Use full width of the container
              height="500px" // Adjust the height as needed
              title="Form Preview"
              style={{ border: 'none' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FormDetails;
