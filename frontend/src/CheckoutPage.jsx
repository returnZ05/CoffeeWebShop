import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './context/CartContext.jsx';
import './index.css';

function CheckoutPage() {
    const [shippingMethod, setShippingMethod] = useState('Drón');
    const [paymentMethod, setPaymentMethod] = useState('Átutalás');
    const [address, setAddress] = useState('');
    const [error, setError] = useState(null);
    
    // UJ ÁLLAPOT: Jelzi, hogy a rendelés feldolgozás alatt van
    const [isProcessing, setIsProcessing] = useState(false); 
    
    const navigate = useNavigate();
    const { token, logout, cartItems, checkout } = useCart(); 

    // JAVÍTOTT KOSÁR ELLENŐRZÉS: Csak akkor navigál vissza, ha a kosár üres ÉS nincs feldolgozás alatt
    if (cartItems.length === 0 && !isProcessing) {
        navigate('/cart');
        return null;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setIsProcessing(true); // Feldolgozás elindítva
        
        const checkoutData = { 
            shippingMethod, 
            paymentMethod, 
            shippingAddress: address 
        };

        try {
            // A Context-ből származó, állapotot frissítő checkout függvény hívása
            await checkout(checkoutData); 

            // FONTOS JAVÍTÁS: Késleltetjük a navigációt 50ms-al,
            // hogy a React állapota stabilizálódjon és ne dobjon vissza a /cart oldalra.
            setTimeout(() => {
                navigate('/checkout-success');
            }, 50); 

        } catch (err) {
            const errorMessage = err.message || "Ismeretlen hiba történt a rendeléskor.";
            
            if (errorMessage.includes("401") || errorMessage.includes("lejárt")) {
                setError("A munkamenet lejárt. Kérlek, jelentkezz be újra.");
                logout();
            } else {
                setError(errorMessage); 
            }
            // Hiba esetén azonnal befejezzük a feldolgozást
            setIsProcessing(false); 
        }
    };

    return (
        <div className="cart-page-container" style={{ maxWidth: '600px' }}>
            <h2>Pénztár</h2>
            <div className="product-card" style={{ maxWidth: '500px', margin: '0 auto' }}>
                <form onSubmit={handleSubmit} className="standard-form">
                    
                    <label htmlFor="checkout-address">Szállítási cím:</label>
                    <input 
                        id="checkout-address"
                        type="text" 
                        value={address} 
                        onChange={(e) => setAddress(e.target.value)} 
                        required 
                    />

                    <label htmlFor="checkout-shipping">Szállítási mód:</label>
                    <select id="checkout-shipping" value={shippingMethod} onChange={(e) => setShippingMethod(e.target.value)}>
                        <option value="Drón">Drón</option>
                        <option value="Lovaskocsi">Lovaskocsi (3 napon belül)</option>
                    </select>

                    <label htmlFor="checkout-payment">Fizetési mód:</label>
                    <select id="checkout-payment" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                        <option value="Átutalás">Átutalás</option>
                        <option value="Utánvét">Utánvét a lovaskocsinál</option>
                    </select>

                    {/* A gomb is tiltott, ha feldolgozás zajlik */}
                    <button type="submit" disabled={isProcessing}>
                        {isProcessing ? 'Feldolgozás...' : 'Rendelés véglegesítése'}
                    </button>
                    
                    {error && <div className="form-error">{error}</div>}
                </form>
            </div>
        </div>
    );
}
export default CheckoutPage;