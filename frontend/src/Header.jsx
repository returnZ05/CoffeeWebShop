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
      <nav>
        <Link to="/">Főoldal</Link>
        
        {user ? (
          <>
            {isAdmin && (
              <Link to="/admin/add-product">Termék hozzáadása</Link>
            )}
          </>
        ) : (
          <>
            <Link to="/registration">Regisztráció</Link>
            <Link to="/login">Bejelentkezés</Link>
          </>
        )}
        
        <Link to="/cart" className="cart-link">
          Kosár ({totalItemsInCart})
        </Link>
      </nav>

      {user && (
        <div className="user-menu-container">
            
            {/* VÁLTOZTATVA: 'user.username' helyett 'Profil' látható */}
            <Link to="/profile" className="user-profile-link">
                <span className="user-icon">👤</span>
                Profil
            </Link>

            {/* A tényleges legördülő tartalom */}
            <div className="dropdown-menu">
                
                {/* 1. Rendeléseim */}
                <Link to="/my-orders" className="dropdown-item">
                    Rendeléseim
                </Link>

                {/* 2. Kilépés */}
                <div onClick={handleLogout} className="dropdown-item logout-item">
                    Kilépés
                </div>
            </div>
        </div>
      )}

    </header>
  );
}

export default Header;