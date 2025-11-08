import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddProductForm() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [image, setImage] = useState(''); // Egyelőre URL-t kérünk
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    // 1. EZ A LÉNYEG: Olvassuk ki a "belépőkártyát" (tokent)
    const token = localStorage.getItem('token');

    if (!token) {
      setError('Hiba: Nincs bejelentkezve.');
      return;
    }

    const productData = {
      name,
      price: parseFloat(price), // Biztos, ami biztos (string -> decimal)
      quantity: parseInt(quantity), // string -> int
      image,
    };

    try {
      const response = await fetch('/api/Products', { // A POST /api/Products végpont
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 2. EZ A MÁSIK LÉNYEG: Elküldjük a tokent a "Fejlécben"
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        // Siker!
        console.log('Termék sikeresen hozzáadva!');
        navigate('/'); // Visszairányítjuk a főoldalra
      } else {
        // Hiba (pl. 401 Unauthorized, 403 Forbidden, 400 Bad Request)
        const errorText = await response.text();
        setError(`Hiba: ${response.status} - ${errorText}`);
      }
    } catch (err) {
      setError('Hálózati hiba: ' + err.message);
    }
  };

  return (
    <div className="add-product-page">
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
        <button type="submit">Termék hozzáadása</button>
        {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
      </form>
    </div>
  );
}

export default AddProductForm;