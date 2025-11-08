import React from 'react';
import { useCart } from './context/CartContext.jsx';
import './index.css';
function CartPage() {

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

            <div key={item.orderedId} className="product-card cart-item-card">
              <img src={item.image} alt={item.name} />

              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p>{item.price.toLocaleString()} Ft / db</p>
              </div>

              <div className="cart-item-controls">
                <label htmlFor={`quantity-${item.orderedId}`}>Mennyiség:</label>
                <input 
                  type="number" 
                  id={`quantity-${item.orderedId}`}
                  value={item.quantity}
                  min="0"

                  onChange={(e) => updateQuantity(item.orderedId, e.target.value)}
                  className="quantity-input"
                />
                <p>Részösszeg: {(item.price * item.quantity).toLocaleString()} Ft</p>
              </div>
              

              <button 
                className="remove-button"
                title="Törlés a kosárból"

                onClick={() => removeFromCart(item.orderedId)}
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