import React, { createContext, useState, useContext, useEffect } from 'react';

// Segédfüggvény, ami az alkalmazás indulásakor betölti az adatot a localStorage-ból
const loadUserFromStorage = () => {
  const userString = localStorage.getItem('user');
  return userString ? JSON.parse(userString) : null;
};

// 1. A Context létrehozása
const CartContext = createContext();

// 2. Létrehozunk egy "Provider"-t (ez adja az adatot)
export function CartProvider({ children }) {
  // === KOSÁR ÁLLAPOT ===
  const [cartItems, setCartItems] = useState([]);
  
  // === FELHASZNÁLÓI (AUTH) ÁLLAPOT ===
  // Betöltjük az adatot a localStorage-ból, hogy a felhasználó bejelentkezve maradjon
  const [user, setUser] = useState(loadUserFromStorage()); 
  const [token, setToken] = useState(localStorage.getItem('token'));

  // --- FELHASZNÁLÓI (AUTH) FUNKCIÓK ---

  // Ezt a LoginForm hívja meg sikeres bejelentkezéskor
  const login = (userData, userToken) => {
    // Elmentjük a React állapotába
    setUser(userData);
    setToken(userToken);
    
    // Elmentjük a böngésző tárhelyére is (hogy a frissítéskor is megmaradjon)
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userToken);
  };

  // Ezt a Header hívja meg
  const logout = () => {
    // Töröljük a React állapotából
    setUser(null);
    setToken(null);
    setCartItems([]); // Kijelentkezéskor ürítsük a kosarat is
    
    // Töröljük a böngésző tárhelyéről
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // --- KOSÁR FUNKCIÓK ---

  // Termék hozzáadása a kosárhoz
  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        // Ha már benne van, csak növeljük a mennyiségét
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Ha új termék, hozzáadjuk 1-es mennyiséggel
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  // Termék törlése a kosárból
  const removeFromCart = (productId) => {
    setCartItems(prevItems => {
      return prevItems.filter(item => item.id !== productId);
    });
  };

  // Mennyiség frissítése
  const updateQuantity = (productId, newQuantity) => {
    const quantity = parseInt(newQuantity, 10);

    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems => {
      return prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity: quantity }
          : item
      );
    });
  };

  // 3. Megosztjuk az ÖSSZES értéket és funkciót az alkalmazással
  return (
    <CartContext.Provider 
      value={{ 
        cartItems, 
        addToCart, 
        removeFromCart, 
        updateQuantity,
        
        user,
        token,
        login,
        logout
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// 4. A "Hook" a könnyű eléréshez (ez változatlan)
export function useCart() {
  return useContext(CartContext);
}