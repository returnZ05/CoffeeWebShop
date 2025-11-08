import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from './context/CartContext.jsx';
import './index.css';

function Header() {
  const { cartItems, user, logout } = useCart();
  const navigate = useNavigate();


  const handleLogout = () => {
    logout();
    navigate('/');
  };


  const totalItemsInCart = cartItems.reduce((total, item) => total + item.quantity, 0);

  const isAdmin = user && user.isAdmin === true;

  return (
    <header>
      <h1>My Webshop</h1>
      
  
      {user && <span className="welcome-message">Üdv, {user.username}!</span>}
      
      <nav>
        <Link to="/">Főoldal</Link>
        
        {user ? (
          <>
            {isAdmin && (
              <Link to="/admin/add-product">Termék hozzáadása</Link>
            )}
            <button onClick={handleLogout} className="logout-button">
              Kilépés
            </button>
          </>
        ) : (
          <>
            <Link to="/registration">Regisztráció</Link>
            <Link to="/login">Bejelentkezés</Link>
          </>
        )}
        
        <Link to="/cart">
          Kosár ({totalItemsInCart})
        </Link>
      </nav>
    </header>
  );
}

export default Header;