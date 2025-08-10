import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Eye, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div 
      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.onSale && (
              <Badge className="bg-red-600 text-white font-semibold">
                -{discountPercentage}% OFF
              </Badge>
            )}
            {product.featured && (
              <Badge className="bg-yellow-500 text-black font-semibold">
                FEATURED
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-300 ${
              inWishlist 
                ? 'bg-red-500 text-white' 
                : 'bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-700 hover:text-red-500'
            }`}
          >
            <Heart className={`h-5 w-5 ${inWishlist ? 'fill-current' : ''}`} />
          </button>

          {/* Hover Actions */}
          <div className={`absolute inset-x-4 bottom-4 transform transition-all duration-300 ${
            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
          }`}>
            <div className="flex gap-2">
              <Button
                onClick={handleAddToCart}
                className="flex-1 bg-black hover:bg-gray-800 text-white rounded-full py-2"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
              <Link to={`/product/${product.id}`}>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full border-black hover:bg-black hover:text-white"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <Link to={`/product/${product.id}`} className="block p-6">
        <div className="mb-3">
          <h3 className="font-bold text-lg text-gray-900 group-hover:text-yellow-600 transition-colors duration-300">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm mt-1 line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating) 
                    ? 'fill-yellow-400 text-yellow-400' 
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">
            {product.rating} ({product.reviews} reviews)
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-lg text-gray-500 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
          
          {/* Category Badge */}
          <Badge variant="outline" className="text-xs font-medium">
            {product.category}
          </Badge>
        </div>

        {/* Product Attributes */}
        <div className="mt-4 flex flex-wrap gap-2">
          {product.colors && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500">Colors:</span>
              {product.colors.slice(0, 3).map((color, index) => (
                <div
                  key={index}
                  className={`w-4 h-4 rounded-full border border-gray-300 ${
                    color.toLowerCase() === 'white' ? 'bg-white' :
                    color.toLowerCase() === 'black' ? 'bg-black' :
                    color.toLowerCase() === 'gold' ? 'bg-yellow-500' :
                    color.toLowerCase() === 'red' ? 'bg-red-500' :
                    'bg-gray-400'
                  }`}
                  title={color}
                />
              ))}
            </div>
          )}
          
          {product.sizes && (
            <div className="text-xs text-gray-500">
              Sizes: {product.sizes.length} available
            </div>
          )}
          
          {product.setSize && (
            <Badge variant="secondary" className="text-xs">
              {product.setSize}
            </Badge>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;