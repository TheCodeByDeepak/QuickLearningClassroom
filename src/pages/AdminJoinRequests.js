import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CSS/AdminJoinRequests.css'

const AdminJoinRequests = ({ classroomId }) => {
  const [joinRequests, setJoinRequests] = useState([]);

  useEffect(() => {
    const fetchJoinRequests = async () => {
      try {
        const token = localStorage.getItem('token'); // Get token from localStorage
        const response = await axios.get(`http://localhost:5000/api/classrooms/${classroomId}/join-request`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        // Set join requests directly from the response without modifying status
        setJoinRequests(response.data);
      } catch (err) {
        console.error(err);
        alert('Failed to fetch join requests');  
      }
    };
    

    fetchJoinRequests();
  }, [classroomId]); // Dependency array includes classroomId to fetch when it changes

  const handleAction = async (studentId, action) => {
    try {
      const token = localStorage.getItem('token'); // Get token from localStorage
      const response = await axios.post(
        'http://localhost:5000/api/classrooms/manage-requests',
        { classroomId, studentId, action },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update join requests after action
      setJoinRequests(prevRequests =>
        prevRequests.map(req => {
          if (req.studentId._id === studentId) {
            return {
              ...req,
              status: action === 'approve' ? 'approved' : 'rejected', // Update status based on action
            };
          }
          return req;
        })
      );

      alert(response.data.message); // Show success message
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to manage join request');
    }
  };

  return (
    <div className='join-request-container-admin'>
      <h3>Manage Join Requests</h3>
      {joinRequests.length === 0 ? (
        <p>No join requests available.</p>
      ) : (
        <ul type='square'>
          {joinRequests.map(req => (
            <li key={req.studentId?._id}> {/* Use studentId's _id as a unique identifier */}
              {req.studentId ? (
                <>
                  <span>Request by: {req.studentId.username}</span> {/* Access username */}
                  
                  
                  {req.status === 'pending' && (
                    <>
                      <button onClick={() => handleAction(req.studentId._id, 'approve')}  className='approve-btn-joinrequest-admin'>Approve</button>
                      <button onClick={() => handleAction(req.studentId._id, 'reject')} className='reject-btn-joinrequest-admin'>Reject</button>
                    </>
                  )}
                  
                  {req.status === 'approved' && (
                    <>
                      <button disabled className='approved-btn-joinrequest-admin'>Approved</button>
                      <button onClick={() => handleAction(req.studentId._id, 'reject')} className='reject-btn-joinrequest-admin'>Reject</button>
                    </>
                  )}

                  {req.status === 'rejected' && (
                    <>
                      <button onClick={() => handleAction(req.studentId._id, 'approve')} className='approve-btn-joinrequest-admin'>Approve</button>
                      <button disabled className='rejected-btn-joinrequest-admin'>Rejected</button>
                    </>
                  )}
                </>
              ) : (
                <span>No student information available.</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminJoinRequests;
