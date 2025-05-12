import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaVideo } from 'react-icons/fa';
import '../CSS/GoogleMeetLinksStudent.css'

const GoogleMeetOverlay = ({ classroomId }) => {
  const [meetLinks, setMeetLinks] = useState([]);
  const [filteredLinks, setFilteredLinks] = useState([]); // For filtered results
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchDate, setSearchDate] = useState(''); // For search input

  useEffect(() => {
    const fetchMeetLinks = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/forms/getGoogleMeetLinks?classroomId=${classroomId}`
        );
        setMeetLinks(response.data);
        setFilteredLinks(response.data); // Set filtered links initially
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

  // Handle date search
  const handleSearch = (e) => {
    const date = e.target.value;
    setSearchDate(date);

    if (date) {
      const filtered = meetLinks.filter((link) => link.date.includes(date));
      setFilteredLinks(filtered);
    } else {
      setFilteredLinks(meetLinks); // Reset if search is cleared
    }
  };

  // Handle clear search
  const handleClear = () => {
    setSearchDate(''); // Clear the search field
    setFilteredLinks(meetLinks); // Reset to show all meet links
  };

  // Function to check if the link's date matches the current date
  const isLinkDateMismatch = (linkDate) => {
    const currentDate = new Date().toISOString().split('T')[0]; // Get current date as YYYY-MM-DD
    const meetDate = linkDate.split('T')[0]; // Ensure the link date is in YYYY-MM-DD format
    return meetDate !== currentDate; // Return true if the dates do not match
  };

  if (loading) return <p>Loading meet links...</p>;
  if (error) return <p>{error}</p>;

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

  return (
    <div style={{ padding: '20px' }}>
      <h3>Live Lecture Links</h3>

      <div className="search-container">
  <label htmlFor="searchDate" className="search-label">
    Search by Date:
  </label>
  <input
    type="date"
    id="searchDate"
    value={searchDate}
    onChange={handleSearch}
    placeholder="Enter date"
    className="search-input"
  />
  <button
    onClick={handleClear}
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
    </tr>
  </thead>
  <tbody>
    {filteredLinks.length === 0 ? (
      <tr>
        <td colSpan="3" className="no-links">
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
              disabled={isLinkDateMismatch(link.date)} // Disable the button if the date doesn't match
              className={`join-button ${isLinkDateMismatch(link.date) ? 'disabled' : ''}`}
            >
              <FaVideo />
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
