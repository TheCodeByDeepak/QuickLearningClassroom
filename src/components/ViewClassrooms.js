import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../pages/CSS/ViewClassrooms.css'

const ViewClassrooms = () => {
    const [classrooms, setClassrooms] = useState([]);
    const [filteredClassrooms, setFilteredClassrooms] = useState([]);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchBy, setSearchBy] = useState('name'); // 'name' or other fields (e.g., ID)
    const [copiedId, setCopiedId] = useState(null); // Track the copied ID

    useEffect(() => {
        const fetchClassrooms = async () => {
            try {
                const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
                const response = await axios.get('http://localhost:5000/api/users/allclassroom', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setClassrooms(response.data);
                setFilteredClassrooms(response.data); // Initialize with full classroom list
            } catch (err) {
                setError('Error fetching classrooms.');
            }
        };
        fetchClassrooms();
    }, []);

    const copyToClipboard = (id) => {
        navigator.clipboard.writeText(id);
        setCopiedId(id); // Set the copied ID to show "Copied"

        // Reset to "Copy" after 3 seconds
        setTimeout(() => setCopiedId(null), 3000);
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = classrooms.filter((classroom) => {
            if (searchBy === 'name') {
                return classroom.name.toLowerCase().includes(query);
            } else if (searchBy === 'id') {
                return classroom._id.toLowerCase().includes(query);
            }
            return false;
        });

        setFilteredClassrooms(filtered);
    };

    const clearSearch = () => {
        setSearchQuery('');
        setFilteredClassrooms(classrooms); // Reset the filtered list to the full list
    };

    return (
        <div className='viewclassroom-container'>
            <h2 className="viewclassroom-title">All Classrooms</h2>
            {error && <p>{error}</p>}

            {/* Search Bar */}
            <div>
                <label htmlFor="searchBy" className='viewclassroom-label'>Search By: </label>
                <select
                    id="searchBy"
                    value={searchBy}
                    onChange={(e) => setSearchBy(e.target.value)}
                    className="viewclassroom-select"
                >
                    <option value="name">Name</option>
                    <option value="id">Classroom ID</option>
                </select>
                <input
                    type="text"
                    placeholder={`Search by ${searchBy}`}
                    value={searchQuery}
                    onChange={handleSearch}
                     className="viewclassroom-input"
                />
                <button
                    onClick={clearSearch}
                    className="viewclassroom-clear" 
                >
                    Clear
                </button>
            </div>

            {/* Classroom List */}
            <ul style={{ listStyleType: 'none', padding: 0, marginTop: '20px' }}>
                {filteredClassrooms.map((classroom) => (
                    <li key={classroom._id} style={{ marginBottom: '1em' }}>
                        <strong>Classroom Name:</strong> {classroom.name} <br />
                        <strong>Subject:</strong> {classroom.subject} <br />
                        <strong>Timing:</strong> {classroom.startTiming} to {classroom.endTiming}<br />
                        <strong>Join Code:</strong> {classroom.code} <br />
                        <strong>Total Faculty: </strong> 
                        {classroom.faculties && classroom.faculties.length > 0 ? classroom.faculties.length : 'No faculty assigned'}<br />
                        <strong>Total Students: </strong> 
                        {classroom.students && classroom.students.length > 0 ? classroom.students.length : 'No faculty assigned'}<br />
                        <strong>Total Join Requests: </strong>
                        {classroom.joinRequests && classroom.joinRequests.length > 0 ? classroom.joinRequests.length : 'No join request'}<br />
                        <strong>Classroom ID:</strong> {classroom._id}
                        <button
                            onClick={() => copyToClipboard(classroom._id)}
                            className="viewclassroom-copy" 
                        >
                            {copiedId === classroom._id ? 'Copied' : 'Copy'}
                        </button>
                    </li>
                ))}
            </ul>

            {filteredClassrooms.length === 0 && <p>No classrooms found.</p>}
        </div>
    );
};

export default ViewClassrooms;
