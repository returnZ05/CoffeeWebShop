import React from 'react';
import { Navigate } from 'react-router-dom';
import { useCart } from './context/CartContext.jsx';

function ProtectedRoute({ children }) {
  const { user } = useCart();

  if (user) {

    return children;
  } else {

    return <Navigate to="/login" replace />;
  }
}

export default ProtectedRoute;