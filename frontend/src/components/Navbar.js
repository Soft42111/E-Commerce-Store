import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Search, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { getCartItemsCount } = useCart();
  const { wishlistItems } = useWishlist();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="bg-black text-white sticky top-0 z-50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              LuxuryLine
            </div>
            <div className="ml-2 text-xs text-gray-400 font-light">
              Where Elegance Meets Function
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 font-medium"
            >
              Home
            </Link>
            <Link 
              to="/shop" 
              className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 font-medium"
            >
              Shop
            </Link>
            <Link 
              to="/shop/sneakers" 
              className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 font-medium"
            >
              Sneakers
            </Link>
            <Link 
              to="/shop/crockery" 
              className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 font-medium"
            >
              Crockery
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Search luxury items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 bg-gray-900 border-gray-700 text-white placeholder-gray-400 focus:border-yellow-400 pr-10"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-400"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <Link to="/wishlist" className="relative p-2 hover:bg-gray-800 rounded-full transition-colors">
              <Heart className="h-6 w-6" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            
            <Link to="/cart" className="relative p-2 hover:bg-gray-800 rounded-full transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {getCartItemsCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                  {getCartItemsCount()}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-800 rounded-full transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <div className="flex flex-col space-y-4">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder="Search luxury items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-900 border-gray-700 text-white placeholder-gray-400 focus:border-yellow-400 pr-10"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-400"
                >
                  <Search className="h-4 w-4" />
                </button>
              </form>
              
              <Link 
                to="/" 
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 font-medium py-2"
              >
                Home
              </Link>
              <Link 
                to="/shop" 
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 font-medium py-2"
              >
                Shop
              </Link>
              <Link 
                to="/shop/sneakers" 
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 font-medium py-2"
              >
                Sneakers
              </Link>
              <Link 
                to="/shop/crockery" 
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 font-medium py-2"
              >
                Crockery
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;