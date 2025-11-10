import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './context/CartContext.jsx';
import './index.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const { login } = useCart();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    const loginData = {
      username: username,
      password: password,
    };

    try {
      const response = await fetch('/api/Users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const authData = await response.json();
        console.log('Sikeres bejelentkezés!', authData);
        login(authData.user, authData.token);
        navigate('/');
      } else {
        const errorMessage = await response.text(); 
        setError(errorMessage);
        console.error('Hiba a bejelentkezésnél:', errorMessage);
      }
    } catch (error) {
      setError('Hálózati hiba. A szerver nem elérhető.');
      console.error('Hálózati hiba:', error);
    }
  };

  return (
    <div className="cart-page-container" style={{ maxWidth: '600px' }}>
      <h2>Bejelentkezés</h2>
      
      <div className="product-card" style={{ maxWidth: '500px', margin: '0 auto' }}>

        <form onSubmit={handleSubmit} className="standard-form">
          
          <label htmlFor="login-username">Felhasználónév:</label>
          <input
            id="login-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          
          <label htmlFor="login-password">Jelszó:</label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <button type="submit">Bejelentkezés</button>
          {error && <div className="form-error">{error}</div>}
        </form>
      </div>
    </div>
  );
}

export default Login;