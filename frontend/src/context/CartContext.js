import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '../hooks/use-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('luxuryline-cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('luxuryline-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, selectedSize = null, selectedColor = null) => {
    const cartItem = {
      ...product,
      cartId: `${product.id}-${selectedSize || 'default'}-${selectedColor || 'default'}`,
      selectedSize,
      selectedColor,
      quantity: 1
    };

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.cartId === cartItem.cartId);
      
      if (existingItem) {
        toast({
          title: "Item Updated",
          description: `${product.name} quantity updated in cart`,
        });
        return prevItems.map(item =>
          item.cartId === cartItem.cartId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        toast({
          title: "Added to Cart",
          description: `${product.name} has been added to your cart`,
        });
        return [...prevItems, cartItem];
      }
    });
  };

  const removeFromCart = (cartId) => {
    setCartItems(prevItems => {
      const item = prevItems.find(item => item.cartId === cartId);
      if (item) {
        toast({
          title: "Removed from Cart",
          description: `${item.name} has been removed from your cart`,
        });
      }
      return prevItems.filter(item => item.cartId !== cartId);
    });
  };

  const updateQuantity = (cartId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.cartId === cartId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('luxuryline-cart');
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};