import { useState } from 'react';

function Registration() {
  // 1. LÉPÉS: Hozz létre state-eket az adatok tárolására
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 2. LÉPÉS: Hozz létre egy 'submit' eseménykezelőt
  const handleSubmit = async (event) => {
    // 3. LÉPÉS: Akadályozd meg az oldal újratöltését
    event.preventDefault();

    // 4. LÉPÉS: Készítsd elő az adatokat (ez lesz a 'RegisterDto' a C# oldalon)
    const registerData = {
      username: username,
      email: email,
      password: password,
    };

    try {
      // 5. LÉPÉS: Küldd el az adatokat 'fetch'-csel a backendnek
      // Figyelem: A '/api' a 'vite.config.js'-ben beállított proxy miatt működik!
      const response = await fetch('/api/Users/register', { // C# kontroller útvonala
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      if (response.ok) {
        // Sikeres regisztráció
        const newUser = await response.json(); // Ez a UserDto, amit a C# visszaad
        console.log('Sikeres regisztráció!', newUser);
        // Ide jöhet az átirányítás a login oldalra
      } else {
        // Sikertelen regisztráció (pl. email foglalt)
        const errorData = await response.json(); // A C# által küldött hiba
        console.error('Hiba a regisztrációnál:', errorData);
      }
    } catch (error) {
      console.error('Hálózati hiba:', error);
    }
  };

  // 6. LÉPÉS: Kösd össze a formot a state-ekkel és az eseménykezelővel
  return (
    <div>
      <h2>Regisztráció oldal</h2>
      {/* NEM action="post", hanem onSubmit={...} */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Felhasználónév:</label>
          {/* Az 'onChange' frissíti a state-et minden gombnyomásra */}
          <input
            type="text" value={username} onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Jelszó:</label>
          <input
            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Regisztráció</button>
      </form>
    </div>
  );
}

export default Registration;