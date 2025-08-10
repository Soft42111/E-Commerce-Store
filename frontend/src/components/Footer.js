import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <div className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                LuxuryLine
              </div>
              <p className="text-gray-400 mt-2 text-sm">
                Where Elegance Meets Function
              </p>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Discover our exclusive collection of premium sneakers and luxury crockery, 
              crafted for those who appreciate the finest things in life.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-gray-800 hover:bg-yellow-500 rounded-full transition-colors duration-300 group">
                <Facebook className="h-5 w-5 text-white group-hover:text-black" />
              </a>
              <a href="#" className="p-2 bg-gray-800 hover:bg-yellow-500 rounded-full transition-colors duration-300 group">
                <Instagram className="h-5 w-5 text-white group-hover:text-black" />
              </a>
              <a href="#" className="p-2 bg-gray-800 hover:bg-yellow-500 rounded-full transition-colors duration-300 group">
                <Twitter className="h-5 w-5 text-white group-hover:text-black" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-yellow-400">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-300 hover:text-yellow-400 transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-gray-300 hover:text-yellow-400 transition-colors duration-200">
                  Shop All
                </Link>
              </li>
              <li>
                <Link to="/shop/sneakers" className="text-gray-300 hover:text-yellow-400 transition-colors duration-200">
                  Sneakers
                </Link>
              </li>
              <li>
                <Link to="/shop/crockery" className="text-gray-300 hover:text-yellow-400 transition-colors duration-200">
                  Crockery
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-yellow-400 transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-yellow-400 transition-colors duration-200">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-yellow-400">Customer Service</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-yellow-400 transition-colors duration-200">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-gray-300 hover:text-yellow-400 transition-colors duration-200">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-gray-300 hover:text-yellow-400 transition-colors duration-200">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link to="/size-guide" className="text-gray-300 hover:text-yellow-400 transition-colors duration-200">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link to="/care-instructions" className="text-gray-300 hover:text-yellow-400 transition-colors duration-200">
                  Care Instructions
                </Link>
              </li>
              <li>
                <Link to="/warranty" className="text-gray-300 hover:text-yellow-400 transition-colors duration-200">
                  Warranty
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-yellow-400">Get in Touch</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-yellow-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">
                    123 Luxury Avenue<br />
                    Premium District, PD 10001<br />
                    United States
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">+1 (555) 123-4567</p>
                  <p className="text-gray-500 text-xs">Mon-Fri, 9AM-6PM EST</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">support@luxuryline.com</p>
                  <p className="text-gray-500 text-xs">We'll respond within 24 hours</p>
                </div>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="mt-8">
              <h4 className="font-semibold mb-3 text-yellow-400">Stay Updated</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                />
                <button className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-r-lg transition-colors duration-300">
                  Subscribe
                </button>
              </div>
              <p className="text-gray-500 text-xs mt-2">
                Get exclusive offers and new product updates
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-wrap gap-6 mb-4 md:mb-0">
              <Link to="/privacy" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors duration-200">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors duration-200">
                Cookie Policy
              </Link>
              <Link to="/accessibility" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors duration-200">
                Accessibility
              </Link>
            </div>
            <div className="text-gray-400 text-sm">
              <p>&copy; 2025 LuxuryLine. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;