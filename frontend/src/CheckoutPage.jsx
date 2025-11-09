import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './context/CartContext.jsx';

function CheckoutPage() {
  const [shippingMethod, setShippingMethod] = useState('Drón');
  const [paymentMethod, setPaymentMethod] = useState('Átutalás');
  const [address, setAddress] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { token, logout } = useCart(); 

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    const checkoutData = { shippingMethod, paymentMethod, shippingAddress: address };

    try {
      const response = await fetch('/api/order/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(checkoutData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Sikertelen rendelés");
      }

      navigate('/checkout-success');

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="checkout-page">
      <h2>Pénztár</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Szállítási cím:</label>
          <input 
            type="text" 
            value={address} 
            onChange={(e) => setAddress(e.target.value)} 
            required 
          />
        </div>

        <div>
          <label>Szállítási módok:</label>
          <select value={shippingMethod} onChange={(e) => setShippingMethod(e.target.value)}>
            <option value="Drón">Drón</option>
            <option value="Lovaskocsi">Lovaskocsi (3 napon belül)</option>
          </select>
        </div>

        <div>
          <label>Fizetési módok:</label>
          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
            <option value="Átutalás">Átutalás</option>
            <option value="Utánvét">Utánvét a lovaskocsinál</option>
          </select>
        </div>

        <button type="submit">Rendelés véglegesítése</button>
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </form>
    </div>
  );
}
export default CheckoutPage;