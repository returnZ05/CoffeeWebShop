import React from 'react';
import { Link } from 'react-router-dom';
import './index.css'

function CheckoutSuccess() {
  return (
    <div className="checkout-success-page" style={{ textAlign: 'center', color: 'white', marginTop: '50px' }}>
      <h2>Köszönjük a rendelésed!</h2>
      <p>A rendelésedet sikeresen fogadtuk, és a készletet frissítettük.</p>
      <Link to="/" style={{ color: '#4CAF50', fontWeight: 'bold' }}>Vissza a főoldalra</Link>
    </div>
  );
}

export default CheckoutSuccess;