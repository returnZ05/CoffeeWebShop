import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './context/CartContext.jsx';
import './index.css';

function Home() {

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addToCart, user } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('/api/Products');
        
        if (!response.ok) {
          throw new Error('A termékek lekérése sikertelen');
        }
        
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    if (user) {
      addToCart(product);
    } else {
      navigate('/login');
    }
  };

  if (isLoading) {
    return <div>Termékek betöltése...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Hiba: {error}</div>;
  }

  return (
    <div className="home-page">
      <h2>Elérhető termékek</h2>
      
      <div className="product-list">

        {products.map(product => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.price.toLocaleString()} Ft</p>
            
            {product.quantity > 0 ? (
              <p className="stock-available">Készleten: {product.quantity} db</p>
            ) : (
              <p className="stock-unavailable">Nincs készleten</p>
            )}

            {product.quantity > 0 ? (
              <button onClick={() => handleAddToCart(product)}>
                Kosárba tesz
              </button>
            ) : (
              <button disabled>Elfogyott</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;