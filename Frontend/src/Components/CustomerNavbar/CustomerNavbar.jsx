import React, { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CustomerNavbar = () => {
  const [orderDropdown, setOrderDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    alert("Logout button clicked!");
    console.log("heyyyyy")
    try {
      const response = await fetch("http://localhost:5000/api/users/logout", {
        method: "POST",
        credentials: "include", // Important for handling cookies
      });

      const data = await response.json();
      console.log(data.message); // "Logged out successfully"

      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="flex justify-between items-center px-10 py-4 shadow-md bg-white">
      {/* Logo as a round image */}
      <img 
        src="/img/Logo.png" // Replace with your actual image path
        alt="Logo" 
        className="w-22 h-22 rounded-full object-cover cursor-pointer"
        onClick={() => navigate("/")} // Navigate to homepage on click
      />

      <ul className="flex space-x-6 text-gray-700">
        <li className="cursor-pointer" onClick={() => navigate("/home")}>Home</li>
        <li className="cursor-pointer" onClick={() =>
    
          navigate("/user/products")}>Products</li>
        <li className="cursor-pointer" onClick={() => navigate("/customization")}>Customization</li>
        <li className="flex items-center gap-1 cursor-pointer" onClick={() => navigate("/mainCart")}>
          <FaShoppingCart /> Cart
        </li>
        <li
          className="relative cursor-pointer" onClick={() => navigate("/orderDetails")}
          onMouseEnter={() => setOrderDropdown(true)}
          onMouseLeave={() => setOrderDropdown(false)}
        >
          Order 
          {/* {orderDropdown && (
            <ul className="absolute bg-white shadow-md mt-1 w-40">
              <li className="px-4 py-2 hover:bg-gray-100">Order 1</li>
              <li className="px-4 py-2 hover:bg-gray-100">Order 2</li>
            </ul>
          )} */}
        </li>
        <li onClick={handleLogout} className="cursor-pointer text-red-500">
          Logout
        </li>
      </ul>
    </nav>
  );
};

export default CustomerNavbar;
