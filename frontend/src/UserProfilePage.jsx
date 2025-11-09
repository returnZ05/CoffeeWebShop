import React, { useState } from 'react';
import { useCart } from './context/CartContext.jsx';
import { Link } from 'react-router-dom';

function UserProfilePage() {
  const { user, token } = useCart();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage(null);
    setIsError(false);

    try {
      const response = await fetch('/api/Users/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ oldPassword, newPassword })
      });

      if (response.ok) {
        setMessage('Jelszó sikeresen megváltoztatva!');
        setOldPassword('');
        setNewPassword('');
      } else {
        const errorText = await response.text();
        setMessage(errorText || 'Hiba történt.');
        setIsError(true);
      }
    } catch (err) {
      setMessage('Hálózati hiba.');
      setIsError(true);
    }
  };

  if (!user) return <div>Jelentkezz be a profil megtekintéséhez.</div>;

  return (
    <div className="cart-page-container" style={{ maxWidth: '600px' }}>
      <h2>Felhasználói Profil</h2>

      <div className="product-card" style={{ marginBottom: '20px' }}>
        <h3>Adatok</h3>
        <p><strong>Felhasználónév:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Státusz:</strong> {user.isAdmin ? 'Adminisztrátor' : 'Vásárló'}</p>
        <div style={{ marginTop: '20px' }}>
          <Link to="/my-orders" className="product-card-link">
              Rendeléseim megtekintése
          </Link>
        </div>
      </div>
      <div className="product-card">
        <h3>Jelszó megváltoztatása</h3>
        <form onSubmit={handleChangePassword}>
          <div>
            <label>Régi jelszó:</label>
            <input 
              type="password" 
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Új jelszó:</label>
            <input 
              type="password" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit">Jelszó csere</button>
        </form>

        {message && (
          <div style={{ marginTop: '15px', padding: '10px', borderRadius: '5px', backgroundColor: isError ? '#ffebee' : '#e8f5e9', color: isError ? '#c62828' : '#2e7d32' }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfilePage;