import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './context/CartContext.jsx';
import './index.css';

function AddProductForm() {
  // Állapotok
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { token } = useCart();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!token) {
      setError('Hiba: Nincs bejelentkezve.');
      return;
    }

    const productData = {
      name,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      image,
      description
    };

    try {
      const response = await fetch('/api/Products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        alert('Termék sikeresen hozzáadva!');
        navigate('/');
      } else {
        const errorText = await response.text();
        setError(`Hiba: ${response.status} - ${errorText}`);
      }
    } catch (err) {
      setError('Hálózati hiba: ' + err.message);
    }
  };

  return (
    <div className="add-product-page"> {/* Használjuk az egységes stílusosztályt */}
      <h2>Új termék hozzáadása (Csak Admin)</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Termék neve:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Ár (Ft):</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>
        <div>
          <label>Készlet (db):</label>
          <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
        </div>
        <div>
          <label>Kép URL:</label>
          <input type="text" value={image} onChange={(e) => setImage(e.target.value)} required />
        </div>
        
        <div>
          <label>Leírás:</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
            rows="5"
            required 
          />
        </div>
        
        <button type="submit">Termék hozzáadása</button>
        
        {/* A hibaüzenet is megkapja az osztályt */}
        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
}

export default AddProductForm;