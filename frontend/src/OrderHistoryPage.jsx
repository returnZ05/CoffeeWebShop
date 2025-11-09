import React, { useState, useEffect } from 'react';
import { useCart } from './context/CartContext.jsx';

function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { token } = useCart(); 

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;

      try {
        setIsLoading(true);
        const response = await fetch('/api/order/my-orders', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('A rendelések lekérése sikertelen');
        }
        
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  if (isLoading) return <div>Korábbi rendelések betöltése...</div>;
  if (error) return <div style={{ color: 'red' }}>Hiba: {error}</div>;

  return (
    <div className="cart-page-container"> {/* Ez a külső, sötét keret (ez már jó) */}
      <h2>Korábbi rendeléseim</h2>
      
      {orders.length === 0 ? (
        <p>Még nincsenek korábbi rendeléseid.</p>
      ) : (
        <div className="cart-list">
          {/* 1. A KÜLSŐ KÁRTYA (egy rendelés) */}
          {orders.map(order => (
            <div key={order.orderId} className="order-card">
              <h4>Rendelés dátuma: {new Date(order.orderDate).toLocaleString('hu-HU')}</h4>
              
              {/* 2. A BELSŐ SOR (a rendelés tételei) */}
              {order.items.map(item => (
                <div key={item.orderedId} className="order-item-row">
                  <img src={item.image} alt={item.name} />
                  <div className="item-info">
                    <h3>{item.name}</h3>
                    <p>{item.price.toLocaleString()} Ft / db</p>
                  </div>
                  <div className="item-details">
                    <p>Mennyiség: {item.quantity}</p>
                    <p>Részösszeg: {(item.price * item.quantity).toLocaleString()} Ft</p>
                  </div>
                </div>
              ))}
              
              {/* 3. A VÉGÖSSZEG */}
              <div className="order-summary">
                <strong>Rendelés végösszege: {order.items.reduce((total, item) => total + item.price * item.quantity, 0).toLocaleString()} Ft</strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderHistoryPage;