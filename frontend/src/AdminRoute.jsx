import React from 'react';
import { Navigate } from 'react-router-dom';

function AdminRoute({ children }) {

  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  const isAdmin = user && user.isAdmin === true;

  if (isAdmin) {
    return children;
  } else {
    return <Navigate to="/" replace />;
  }
  
}

export default AdminRoute;