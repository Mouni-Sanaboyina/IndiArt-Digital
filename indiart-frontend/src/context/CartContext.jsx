import { createContext, useContext, useState, useCallback } from 'react';
import API from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [cart, setCart] = useState(null);
  const { isLoggedIn } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!isLoggedIn) { setCartCount(0); setCart(null); return; }
    try {
      const { data } = await API.get('/cart');
      setCart(data.cart);
      setCartCount(data.cart?.items?.length || 0);
    } catch {
      setCartCount(0);
    }
  }, [isLoggedIn]);

  const clearCartState = () => { setCart(null); setCartCount(0); };

  return (
    <CartContext.Provider value={{ cart, cartCount, fetchCart, clearCartState, setCart, setCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);