import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Plus, Minus, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent } from '../components/ui/card';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { mockProducts } from '../components/mock';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const foundProduct = mockProducts.find(p => p.id === parseInt(id));
    if (foundProduct) {
      setProduct(foundProduct);
      setSelectedColor(foundProduct.colors ? foundProduct.colors[0] : '');
      setSelectedSize(foundProduct.sizes ? foundProduct.sizes[0] : '');
      
      // Get related products from same category
      const related = mockProducts
        .filter(p => p.category === foundProduct.category && p.id !== foundProduct.id)
        .slice(0, 4);
      setRelatedProducts(related);
    }
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
            <Button onClick={() => navigate('/shop')}>Back to Shop</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor);
  };

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  const previousImage = () => {
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li>
              <button onClick={() => navigate('/')} className="text-gray-700 hover:text-yellow-600">Home</button>
            </li>
            <li>/</li>
            <li>
              <button onClick={() => navigate('/shop')} className="text-gray-700 hover:text-yellow-600">Shop</button>
            </li>
            <li>/</li>
            <li>
              <button 
                onClick={() => navigate(`/shop/${product.category}`)} 
                className="text-gray-700 hover:text-yellow-600 capitalize"
              >
                {product.category}
              </button>
            </li>
            <li>/</li>
            <li className="text-yellow-600 font-medium">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative group">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-96 lg:h-[500px] object-cover rounded-2xl shadow-xl"
              />
              
              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={previousImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}

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
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index 
                        ? 'border-yellow-500 scale-105' 
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating) 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <div className="flex flex-col">
                    <span className="text-xl text-gray-500 line-through">
                      ${product.originalPrice}
                    </span>
                    <Badge className="bg-red-100 text-red-800 text-xs">
                      Save ${product.originalPrice - product.price}
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            <p className="text-gray-700 text-lg leading-relaxed">
              {product.description}
            </p>

            {/* Color Selection */}
            {product.colors && (
              <div>
                <h3 className="font-semibold mb-3 text-black">Color: {selectedColor}</h3>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-12 h-12 rounded-full border-2 transition-all ${
                        selectedColor === color 
                          ? 'border-black scale-110' 
                          : 'border-gray-300 hover:border-gray-500'
                      } ${
                        color.toLowerCase() === 'white' ? 'bg-white' :
                        color.toLowerCase() === 'black' ? 'bg-black' :
                        color.toLowerCase() === 'gold' ? 'bg-yellow-500' :
                        color.toLowerCase() === 'red' ? 'bg-red-500' :
                        color.toLowerCase() === 'brown' ? 'bg-amber-800' :
                        'bg-gray-400'
                      }`}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && (
              <div>
                <h3 className="font-semibold mb-3 text-black">Size: {selectedSize}</h3>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-lg transition-all ${
                        selectedSize === size 
                          ? 'border-black bg-black text-white' 
                          : 'border-gray-300 hover:border-gray-500'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Materials */}
            {product.materials && (
              <div>
                <h3 className="font-semibold mb-3 text-black">Materials</h3>
                <div className="flex gap-2 flex-wrap">
                  {product.materials.map((material, index) => (
                    <Badge key={index} variant="outline">
                      {material}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Set Size */}
            {product.setSize && (
              <div>
                <h3 className="font-semibold mb-2 text-black">Set Information</h3>
                <Badge className="bg-blue-100 text-blue-800">
                  {product.setSize}
                </Badge>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="font-semibold mb-3 text-black">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-gray-100"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-gray-600">
                  Total: ${(product.price * quantity).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4">
              <Button
                onClick={handleAddToCart}
                size="lg"
                className="bg-black hover:bg-gray-800 text-white py-4 text-lg font-semibold rounded-full transition-all transform hover:scale-105"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              
              <Button
                onClick={handleWishlistToggle}
                variant="outline"
                size="lg"
                className={`py-4 text-lg font-semibold rounded-full transition-all ${
                  inWishlist 
                    ? 'border-red-500 text-red-500 hover:bg-red-50' 
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Heart className={`mr-2 h-5 w-5 ${inWishlist ? 'fill-current' : ''}`} />
                {inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </Button>
            </div>

            {/* Features */}
            <div className="border-t pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-yellow-600" />
                  <span className="text-sm text-gray-600">Free Shipping</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-yellow-600" />
                  <span className="text-sm text-gray-600">2 Year Warranty</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="h-5 w-5 text-yellow-600" />
                  <span className="text-sm text-gray-600">30-Day Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mb-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="description" className="text-lg">Description</TabsTrigger>
              <TabsTrigger value="specifications" className="text-lg">Specifications</TabsTrigger>
              <TabsTrigger value="reviews" className="text-lg">Reviews ({product.reviews})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="space-y-4">
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4">Product Description</h3>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {product.description}
                  </p>
                  <p className="text-gray-700 leading-relaxed mt-4 text-lg">
                    This premium {product.category} item is crafted with the finest materials and attention to detail. 
                    Each piece represents our commitment to luxury and quality, designed to exceed your expectations 
                    and provide lasting satisfaction.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="specifications" className="space-y-4">
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6">Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Category</h4>
                      <p className="text-gray-700 capitalize">{product.category}</p>
                    </div>
                    {product.colors && (
                      <div>
                        <h4 className="font-semibold mb-2">Available Colors</h4>
                        <p className="text-gray-700">{product.colors.join(', ')}</p>
                      </div>
                    )}
                    {product.sizes && (
                      <div>
                        <h4 className="font-semibold mb-2">Available Sizes</h4>
                        <p className="text-gray-700">{product.sizes.join(', ')}</p>
                      </div>
                    )}
                    {product.materials && (
                      <div>
                        <h4 className="font-semibold mb-2">Materials</h4>
                        <p className="text-gray-700">{product.materials.join(', ')}</p>
                      </div>
                    )}
                    {product.setSize && (
                      <div>
                        <h4 className="font-semibold mb-2">Set Information</h4>
                        <p className="text-gray-700">{product.setSize}</p>
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold mb-2">Rating</h4>
                      <p className="text-gray-700">{product.rating}/5 stars</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="space-y-4">
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6">Customer Reviews</h3>
                  <div className="space-y-6">
                    <div className="border-b pb-4">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <span className="font-semibold">Sarah M.</span>
                        <span className="text-gray-500 text-sm">Verified Purchase</span>
                      </div>
                      <p className="text-gray-700">
                        "Absolutely love this {product.name}! The quality exceeds expectations and the attention to detail is remarkable. Highly recommended!"
                      </p>
                    </div>
                    
                    <div className="border-b pb-4">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <span className="font-semibold">James K.</span>
                        <span className="text-gray-500 text-sm">Verified Purchase</span>
                      </div>
                      <p className="text-gray-700">
                        "Premium quality as advertised. Fast shipping and excellent customer service. Will definitely shop here again!"
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-8 text-center text-black">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;