import React from 'react'
import { FaShoppingCart } from "react-icons/fa";

const CustomerFooter = () => {
  return (
    <div>
        <footer className="bg-gray-900 text-white py-10">
  <div className="container mx-auto px-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
    
    {/* About Us */}
    <div>
      <h3 className="text-2xl font-semibold">About Coffee Bug</h3>
      <p className="text-gray-400 mt-3 leading-relaxed">
        We serve freshly brewed coffee with love. Customize your perfect cup and enjoy the taste of perfection.
      </p>
    </div>
    
    {/* Quick Links */}
    <div>
      <h3 className="text-2xl font-semibold">Quick Links</h3>
      <ul className="mt-3 space-y-2">
        <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition">Home</a></li>
        <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition">Menu</a></li>
        <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition">Order</a></li>
        <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition">Contact</a></li>
      </ul>
    </div>
    
    {/* Social Media */}
    <div>
      <h3 className="text-2xl font-semibold">Follow Us</h3>
      <div className="flex justify-center md:justify-start space-x-4 mt-3">
        <a href="#" className="text-gray-400 hover:text-blue-500 transition">Facebook</a>
        <a href="#" className="text-gray-400 hover:text-pink-500 transition">Instagram</a>
        <a href="#" className="text-gray-400 hover:text-blue-400 transition">Twitter</a>
      </div>
    </div>

  </div>
  
  {/* Copyright */}
  <p className="text-center text-gray-500 mt-8 border-t border-gray-700 pt-4">© 2025 Coffee Bug. All Rights Reserved.</p>
</footer>


    </div>
  )
}

export default CustomerFooter;