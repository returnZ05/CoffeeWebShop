import React from 'react';
import { useCart } from './context/CartContext.jsx'; // Importáljuk a hook-ot

function CartPage() {
  // 1. Kérjük el az ÚJ funkciókat is a Context-ből
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="cart-page-container">
      <h2>Kosár tartalma</h2>
      
      {cartItems.length === 0 ? (
        <p>A kosarad jelenleg üres.</p>
      ) : (
        <div className="cart-list">
          {cartItems.map(item => (
            // 2. Kicsit átalakítjuk a kártyát, hogy elférjenek az új elemek
            <div key={item.id} className="product-card cart-item-card"> {/* Adtam neki egy extra osztályt */}
              <img src={item.image} alt={item.name} />
              
              {/* Információs rész */}
              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p>{item.price.toLocaleString()} Ft / db</p>
              </div>

              {/* Mennyiség módosító rész */}
              <div className="cart-item-controls">
                <label htmlFor={`quantity-${item.id}`}>Mennyiség:</label>
                <input 
                  type="number" 
                  id={`quantity-${item.id}`}
                  value={item.quantity}
                  min="1" // A 0-t vagy az alatti számot a funkció törlésként kezeli
                  // 3. Meghívjuk a frissítést az érték változásakor
                  onChange={(e) => updateQuantity(item.id, e.target.value)}
                  className="quantity-input"
                />
                <p>Részösszeg: {(item.price * item.quantity).toLocaleString()} Ft</p>
              </div>
              
              {/* 4. ÚJ Törlés gomb (az "X") */}
              <button 
                className="remove-button"
                title="Törlés a kosárból"
                onClick={() => removeFromCart(item.id)}
              >
                X
              </button>
            </div>
          ))}
        </div>
      )}
      
      {cartItems.length > 0 && (
        <div className="cart-summary">
          <h3>Végösszeg: {totalPrice.toLocaleString()} Ft</h3>
          <button>Tovább a pénztárhoz</button>
        </div>
      )}
    </div>
  );
}

export default CartPage;