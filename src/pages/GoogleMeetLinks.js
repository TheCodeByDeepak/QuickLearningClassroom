import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaVideo, FaTrash } from 'react-icons/fa';
import './CSS/GoogleMeetLinks.css'

const GoogleMeetOverlay = ({ classroomId }) => {
  const [meetLinks, setMeetLinks] = useState([]);
  const [filteredLinks, setFilteredLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchDate, setSearchDate] = useState('');

  useEffect(() => {
    const fetchMeetLinks = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/forms/getGoogleMeetLinks?classroomId=${classroomId}`
        );
        setMeetLinks(response.data);
        setFilteredLinks(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching meet links:', err);
        setError('No Live Lecture link found.');
        setLoading(false);
      }
    };

    if (classroomId) {
      fetchMeetLinks();
    }
  }, [classroomId]);

  const handleDeleteMeetLink = async (date, liveLink) => {
    // Optimistically update the UI by immediately removing the link
    setMeetLinks((prevLinks) =>
      prevLinks.filter((link) => !(link.date === date && link.liveLink === liveLink))
    );
    setFilteredLinks((prevLinks) =>
      prevLinks.filter((link) => !(link.date === date && link.liveLink === liveLink))
    );

    try {
      const response = await axios.delete('http://localhost:5000/api/forms/deleteGoogleMeetLink', {
        data: {
          classroomId,
          date,
          liveLink,
        },
      });
      console.log(response.data.message);

      // Set success message
      setSuccessMessage('Live lecture link deleted successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error("Error deleting meet link:", error);

      // Revert UI changes if the request fails
      setMeetLinks((prevLinks) => [...prevLinks, { date, liveLink }]);
      setFilteredLinks((prevLinks) => [...prevLinks, { date, liveLink }]);
    }
  };

  const handleJoinMeet = (link) => {
    const width = 800;
    const height = 600;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    window.open(
      link,
      '_blank',
      `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
    );
  };

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchDate(value);

    if (value === '') {
      setFilteredLinks(meetLinks); 
    } else {
      const filtered = meetLinks.filter((link) =>
        link.date.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredLinks(filtered);
    }
  };

  const handleClearSearch = () => {
    setSearchDate('');
    setFilteredLinks(meetLinks);
  };

  const isJoinable = (date) => {
    const currentDate = new Date().toISOString().split('T')[0];
    return currentDate === date;
  };

  if (loading) return <p>Loading meet links...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h3>Live Lecture Links</h3>

      {successMessage && (
        <p style={{ color: 'green', fontWeight: 'bold', marginBottom: '10px' }}>
          {successMessage}
        </p>
      )}

      <div className="search-container">
        <label htmlFor="searchDate"className="search-label">
          Search by Date:
        </label>
        <input
          type="date"
          id="searchDate"
          value={searchDate}
          onChange={handleSearchChange}
          className="search-input"
        />
        <button
          onClick={handleClearSearch}
          className="clear-button"
        >
          Clear
        </button>
      </div>

      <table className="links-table">
        <thead>
          <tr>
            <th className="table-header">Date</th>
            <th className="table-header">Note</th>
            <th className="table-header">Join</th>
            <th className="table-header">Delete</th>
          </tr>
        </thead>
        <tbody>
          {filteredLinks.length === 0 ? (
            <tr>
              <td colSpan="4" className="no-links">
                No meet links found for this classroom.
              </td>
            </tr>
          ) : (
            filteredLinks.map((link) => (
              <tr key={link.id}>
                <td className="table-cell">{link.date}</td>
                <td className="table-cell">{link.note}</td>
                <td className="table-cell">
                  <button
                    onClick={() => handleJoinMeet(link.liveLink)}
                    disabled={!isJoinable(link.date)}
                    style={{
                      color: isJoinable(link.date) ? 'green' : 'grey',
                      fontSize: '24px',
                      border: 'none',
                      background: 'none',
                      cursor: isJoinable(link.date) ? 'pointer' : 'not-allowed',
                    }}
                  >
                    <FaVideo />
                  </button>
                </td>
                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                  <button
                    onClick={() => handleDeleteMeetLink(link.date, link.liveLink)}
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
    </div>
  );
};

export default GoogleMeetOverlay;