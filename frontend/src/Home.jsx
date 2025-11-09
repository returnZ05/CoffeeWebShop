import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from './context/CartContext.jsx';
import './index.css';

function Home() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addToCart, user, token } = useCart(); 
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

  const handleDelete = async (productId) => {
    if (!window.confirm("Biztosan törölni szeretnéd ezt a terméket?")) {
      return;
    }

    try {
      const response = await fetch(`/api/Products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}` 
        }
      });

      if (response.ok) {
        setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
      } else {
        const errorText = await response.text();
        alert(`Törlési hiba: ${errorText}`);
      }
    } catch (err) {
      alert(`Hálózati hiba: ${err.message}`);
    }
  };

  const handleEdit = (productId) => {
    navigate(`/admin/edit-product/${productId}`);
  };

  if (isLoading) return <div>Termékek betöltése...</div>;
  if (error) return <div style={{ color: 'red' }}>Hiba: {error}</div>;

  const isAdmin = user && user.isAdmin === true;

  return (
    <div className="home-page">
      <h2>Elérhető termékek</h2>
      <div className="product-list">
        {products.map(product => (
          <div key={product.id} className="product-card">
            
            <Link to={`/product/${product.id}`} className="product-card-link">
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
            </Link>
            
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

            {isAdmin && (
              <div className="admin-buttons" style={{marginTop: '10px', display: 'flex', justifyContent: 'space-around'}}>
                <button style={{backgroundColor: '#f44336'}} onClick={() => handleDelete(product.id)}>
                  Törlés
                </button>
                <button style={{backgroundColor: '#ff9800'}} onClick={() => handleEdit(product.id)}>
                  Szerkesztés
                </button>
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;