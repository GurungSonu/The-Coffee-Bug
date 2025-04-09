import React from "react";
import { Link } from "react-router-dom";
import { FaBox, FaShoppingCart, FaUser, FaCogs, FaSignOutAlt, FaCartPlus, FaLeaf } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdminSidebar = () => {
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
    <div className="w-64 h-screen bg-gradient-to-b from-blue-300 to-blue-500 p-6 text-white">
      <h2 className="text-2xl font-bold mb-6">Coffee Bug</h2>
      <ul>
        <li className="mb-4">
          <Link to="/dashboard" className="flex items-center gap-2">
            <FaBox /> Dashboard
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/orders" className="flex items-center gap-2">
            <FaShoppingCart /> Orders
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/users" className="flex items-center gap-2">
            <FaUser /> Customers
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/createProduct" className="flex items-center gap-2">
            <FaCartPlus /> Add Products
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/manageIngredient" className="flex items-center gap-2">
            <FaLeaf /> Manage Ingredients
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/admin/products" className="flex items-center gap-2">
            <FaShoppingCart /> Products
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/custom-products" className="flex items-center gap-2">
            <FaShoppingCart /> Custom Products
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/settings" className="flex items-center gap-2">
            <FaCogs /> Settings
          </Link>
        </li>
        <li onClick={handleLogout} className="mt-6">
          <button className="flex items-center gap-2 text-red-300">
            <FaSignOutAlt /> Log out
          </button>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
