import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { mockProducts, testimonials, categories } from '../components/mock';

const Home = () => {
  const featuredProducts = mockProducts.filter(product => product.featured).slice(0, 4);
  const onSaleProducts = mockProducts.filter(product => product.onSale).slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent leading-tight">
            LUXURYLINE
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 font-light tracking-wide">
            Where Elegance Meets Function
          </p>
          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Discover our exclusive collection of premium sneakers and luxury crockery, 
            crafted for those who appreciate the finest things in life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild
              size="lg"
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold px-8 py-4 rounded-full transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <Link to="/shop">
                Explore Collection <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black px-8 py-4 rounded-full transition-all duration-300 hover:scale-105"
            >
              <Link to="/shop/sneakers">
                Shop Sneakers
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 border border-yellow-500 opacity-20 rotate-45 animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-16 h-16 border border-yellow-500 opacity-30 rotate-12 animate-bounce"></div>
        <div className="absolute top-1/2 right-10 w-12 h-12 bg-gradient-to-r from-yellow-500 to-red-600 opacity-20 rotate-45 animate-spin-slow"></div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">
              Our Collections
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Discover our carefully curated collections of premium products
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/shop/${category.slug}`}
                className="group relative overflow-hidden rounded-2xl shadow-2xl transform transition-all duration-500 hover:scale-105"
              >
                <div className="aspect-w-16 aspect-h-12">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="text-3xl font-bold text-white mb-2">{category.name}</h3>
                  <p className="text-gray-300 text-lg mb-4">{category.description}</p>
                  <div className="flex items-center text-yellow-400 font-semibold">
                    Shop Now <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-2" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">
              Featured Products
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Handpicked premium items that define luxury and elegance
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button 
              asChild
              className="bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-full transition-all duration-300 hover:scale-105"
            >
              <Link to="/shop">
                View All Products <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Sale Section */}
      <section className="py-20 bg-gradient-to-r from-red-900 via-red-800 to-red-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Limited Time Offers
            </h2>
            <p className="text-red-200 text-lg max-w-2xl mx-auto">
              Don't miss out on these exclusive deals on luxury items
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {onSaleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">
              What Our Clients Say
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Trusted by luxury enthusiasts worldwide
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="border-none shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 text-lg italic">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4 object-cover"
                    />
                    <div>
                      <p className="font-semibold text-black">{testimonial.name}</p>
                      <p className="text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                Crafting Excellence Since Day One
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                LuxuryLine was born from a passion for exceptional craftsmanship and timeless design. 
                We believe that true luxury lies in the perfect balance between aesthetic beauty and functional excellence.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                Every piece in our collection is carefully selected and crafted to meet the highest standards 
                of quality, ensuring that our customers experience nothing short of perfection.
              </p>
              <Button 
                asChild
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:scale-105"
              >
                <Link to="/about">
                  Learn More About Us <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-red-600 opacity-20 blur-3xl"></div>
              <img
                src={featuredProducts[0]?.images[0]}
                alt="Luxury craftsmanship"
                className="relative z-10 w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;