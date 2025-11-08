import React, { createContext, useState, useContext, useEffect } from 'react';


const CartContext = createContext();

export function CartProvider({ children }) {

  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);

  const apiFetch = async (endpoint, options = {}) => {
    if (!token) throw new Error('Nincs bejelentkezve');

    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    const response = await fetch(endpoint, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Hiba (${response.status}): ${errorText}`);
    }
    
    return response.json();
  };


  useEffect(() => {
    const loadCart = async () => {
      if (user) {
        try {
          const cartData = await apiFetch('/api/cart');
          setCartItems(cartData.items || []);
        } catch (error) {
          console.error("Hiba a kosár betöltésekor:", error.message);
        }
      } else {
        setCartItems([]);
      }
    };

    loadCart();
  }, [user]);


  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userToken);

  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setCartItems([]);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };


  const addToCart = async (product) => {
    try {
      const updatedCart = await apiFetch(`/api/cart/add/${product.id}`, {
        method: 'POST'
      });
      setCartItems(updatedCart.items);
    } catch (error) {
      console.error("Hiba a kosárba tételkor:", error.message);
    }
  };

  const removeFromCart = async (orderedItemId) => {
    try {
      const updatedCart = await apiFetch(`/api/cart/remove/${orderedItemId}`, {
        method: 'DELETE'
      });
      setCartItems(updatedCart.items);
    } catch (error) {
      console.error("Hiba a tétel törlésekor:", error.message);
    }
  };

  const updateQuantity = async (orderedItemId, newQuantity) => {
    const quantity = parseInt(newQuantity, 10);
    
    try {

      const updatedCart = await apiFetch(`/api/cart/update/${orderedItemId}/${quantity}`, {
        method: 'PUT'
      });
      setCartItems(updatedCart.items);
    } catch (error) {
      console.error("Hiba a mennyiség frissítésekor:", error.message);
    }
  };

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


export function useCart() {
  return useContext(CartContext);
}