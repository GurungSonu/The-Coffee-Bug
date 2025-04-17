import React from "react";
import { Link, useNavigate } from "react-router-dom";

const CustomerNavbar = () => {
  const authData = JSON.parse(localStorage.getItem("authData"));
  const isLoggedIn = !!authData?.token;
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authData");
    navigate("/login");
  };

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white shadow">
      <div className="text-xl font-bold text-brown-700">CoffeeBug</div>

      <nav className="flex gap-6 font-semibold text-gray-700">
        <Link to="/">Home</Link>
        <Link to="/user/products">Product</Link>
        {isLoggedIn && <Link to="/customization">Customization</Link>}
        {isLoggedIn && <Link to="/orderList">Orders</Link>}
        {isLoggedIn && <Link to="/mainCart">Cart</Link>}
      </nav>

      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <>
            <button
              onClick={handleLogout}
              className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-4 py-1 border border-green-500 text-green-500 rounded hover:bg-green-50"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default CustomerNavbar;
