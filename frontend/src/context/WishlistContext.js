import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '../hooks/use-toast';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('luxuryline-wishlist');
    if (savedWishlist) {
      setWishlistItems(JSON.parse(savedWishlist));
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('luxuryline-wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = (product) => {
    setWishlistItems(prevItems => {
      const isAlreadyInWishlist = prevItems.some(item => item.id === product.id);
      
      if (isAlreadyInWishlist) {
        toast({
          title: "Already in Wishlist",
          description: `${product.name} is already in your wishlist`,
        });
        return prevItems;
      } else {
        toast({
          title: "Added to Wishlist",
          description: `${product.name} has been added to your wishlist`,
        });
        return [...prevItems, product];
      }
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems(prevItems => {
      const item = prevItems.find(item => item.id === productId);
      if (item) {
        toast({
          title: "Removed from Wishlist",
          description: `${item.name} has been removed from your wishlist`,
        });
      }
      return prevItems.filter(item => item.id !== productId);
    });
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.id === productId);
  };

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};