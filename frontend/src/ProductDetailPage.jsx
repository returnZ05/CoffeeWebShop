import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from './context/CartContext.jsx';
import './index.css'; // Feltételezem, hogy a stílusok itt vannak

function ProductDetailPage() {
  const [product, setProduct] = useState(null); // Egyetlen termék, ezért 'null'
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useParams(); // 1. Kiolvassuk az ID-t az URL-ből
  const { addToCart, user } = useCart();
  const navigate = useNavigate();

  // 2. Adatlekérés az ID alapján
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/Products/${id}`);
        if (!response.ok) {
          throw new Error('A termék betöltése sikertelen.');
        }
        
        const data = await response.json();
        setProduct(data); // Elmentjük az egy terméket a state-be
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]); // Akkor fusson le, ha az 'id' megváltozik

  // 3. "Kosárba tesz" logika (ugyanaz, mint a Home.jsx-en)
  const handleAddToCart = () => {
    if (user) {
      addToCart(product);
    } else {
      // Ha nincs bejelentkezve, átirányítjuk a login oldalra
      navigate('/login');
    }
  };

  // Feltételes renderelés
  if (isLoading) return <div>Termékadatok betöltése...</div>;
  if (error) return <div style={{ color: 'red' }}>Hiba: {error}</div>;
  if (!product) return <div>A termék nem található.</div>; // Ha valamiért 'null' marad

  // 4. Megjelenítés
  return (
    <div className="product-detail-container">
      <img src={product.image} alt={product.name} />
      <div className="product-detail-info">
        <h2>{product.name}</h2>
        <p className="product-price">{product.price.toLocaleString()} Ft</p>
        
        {/* JAVÍTVA: A leírás most már a 'product' objektumból jön */}
        <p className="product-description">
          {product.description}
        </p>

        {product.quantity > 0 ? (
          <p className="stock-available">Készleten: {product.quantity} db</p>
        ) : (
          <p className="stock-unavailable">Nincs készleten</p>
        )}

        {product.quantity > 0 ? (
          <button onClick={handleAddToCart} style={{padding: '15px 25px', fontSize: '1.2em'}}>
            Kosárba tesz
          </button>
        ) : (
          <button disabled>Elfogyott</button>
        )}
      </div>
    </div>
  );
}

export default ProductDetailPage;