import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
  const storedRole = localStorage.getItem('role');
  const token = localStorage.getItem('token');

  // Check if the user has a valid token and matches the required role
  if (!token || (role && storedRole !== role)) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
