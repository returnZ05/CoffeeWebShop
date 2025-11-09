import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from './context/CartContext.jsx';
import './index.css';

function EditProductForm() {
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    quantity: 0,
    image: '',
    description: ''
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { id } = useParams();
  const { token } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/Products/${id}`);
        if (!response.ok) {
          throw new Error('A termék betöltése sikertelen.');
        }
        
        const data = await response.json();
        setFormData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    const updateData = {
      ...formData,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity)
    };

    try {
      const response = await fetch(`/api/Products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        alert('Termék sikeresen frissítve!');
        navigate('/');
      } else {
        const errorText = await response.text();
        setError(`Hiba a mentés során: ${response.status} - ${errorText}`);
      }
    } catch (err) {
      setError('Hálózati hiba: ' + err.message);
    }
  };

  if (isLoading) return <div>Termékadatok betöltése...</div>;
  if (error && !formData.name) return <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>;

  return (
    <div className="add-product-page">
      <h2>Termék szerkesztése (ID: {id})</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Termék neve:</label>
          <input 
            type="text" 
            name="name"
            value={formData.name} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <label>Ár (Ft):</label>
          <input 
            type="number" 
            name="price"
            value={formData.price} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <label>Készlet (db):</label>
          <input 
            type="number" 
            name="quantity"
            value={formData.quantity} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <label>Kép URL:</label>
          <input 
            type="text" 
            name="image"
            value={formData.image} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <label>Leírás:</label>
          <textarea 
            name="description"
            value={formData.description} 
            onChange={handleChange}
            rows="5"
            required 
          />
        </div>
        <button type="submit">Módosítások mentése</button>
        {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
      </form>
    </div>
  );
}

export default EditProductForm;