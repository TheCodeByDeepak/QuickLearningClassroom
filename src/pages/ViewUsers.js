import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../pages/CSS/ViewUsers.css'

const ViewUsers = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchBy, setSearchBy] = useState('name'); // 'name' or 'email'
    const [copiedId, setCopiedId] = useState(null); // Track the copied ID

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
                const response = await axios.get('http://localhost:5000/api/users/all', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUsers(response.data);
                setFilteredUsers(response.data); // Initialize with full user list
            } catch (err) {
                setError('Error fetching users.');
            }
        };
        fetchUsers();
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

        const filtered = users.filter((user) => {
            if (searchBy === 'name') {
                return user.username.toLowerCase().includes(query);
            } else if (searchBy === 'email') {
                return user.email.toLowerCase().includes(query);
            }
            return false;
        });

        setFilteredUsers(filtered);
    };

    const clearSearch = () => {
        setSearchQuery('');
        setFilteredUsers(users); // Reset the filtered list to the full list
    };

    return (
        <div className='viewuser-container'>
            <h2 className='viewuser-title'>All Users</h2>
            {error && <p>{error}</p>}

            {/* Search Bar */}
            <div>
                <label htmlFor="searchBy" className='viewuser-label'>Search By: </label>
                <select
                    id="searchBy"
                    value={searchBy}
                    onChange={(e) => setSearchBy(e.target.value)}
                    className='viewuser-select'
                >
                    <option value="name">Name</option>
                    <option value="email">Email</option>
                </select>
                <input
                    type="text"
                    placeholder={`Search by ${searchBy}`}
                    value={searchQuery}
                    onChange={handleSearch}
                   className='viewuser-input'
                />
                <button
                    onClick={clearSearch}
                    className='viewuser-clear'
                >
                    Clear
                </button>
            </div>

            {/* User List */}
            <ul style={{ listStyleType: 'none', padding: 0, marginTop: '20px' }}>
                {filteredUsers.map((user) => (
                    <li key={user._id} style={{ marginBottom: '1em' }}>
                        <strong>Username:</strong> {user.username} <br />
                        <strong>Email:</strong> {user.email}
                        <button
                            onClick={() => copyToClipboard(user.email)}
                            className='viewuser-copy'
                        >
                            {copiedId === user.email ? 'Copied' : 'Copy'}
                        </button> <br />
                        <strong>Role:</strong> {user.role} <br />
                        <strong>ID:</strong> {user._id}
                        <button
                            onClick={() => copyToClipboard(user._id)}
                            className='viewuser-copy'
                        >
                            {copiedId === user._id ? 'Copied' : 'Copy'}
                        </button>
                    </li>
                ))}
            </ul>

            {filteredUsers.length === 0 && <p>No users found.</p>}
        </div>
    );
};

export default ViewUsers;
