import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

function Registration() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    const registerData = {
      username: username,
      email: email,
      password: password,
    };

    try {
      const response = await fetch('/api/Users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      if (response.ok) {
        const newUser = await response.json();
        console.log('Sikeres regisztráció!', newUser);
        alert('Sikeres regisztráció! Most már bejelentkezhetsz.');
        navigate('/login');

      } else {
        const errorMessage = await response.text(); 
        setError(errorMessage);
        console.error('Hiba a regisztrációnál:', errorMessage);
      }
    } catch (error) {
      setError('Hálózati hiba. A szerver nem elérhető.');
      console.error('Hálózati hiba:', error);
    }
  };

  return (
    <div className="cart-page-container" style={{ maxWidth: '600px' }}>
      <h2>Regisztráció oldal</h2>

      <div className="product-card" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit} className="standard-form">
          
          <label htmlFor="reg-username">Felhasználónév:</label>
          <input
            id="reg-username"
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          
          <label htmlFor="reg-email">Email:</label>
          <input
            id="reg-email"
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <label htmlFor="reg-password">Jelszó:</label>
          <input
            id="reg-password"
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Regisztráció</button>
          {error && <div className="form-error">{error}</div>}
        </form>
      </div>
    </div>
  );
}

export default Registration;