import React from 'react'
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { FiMail, FiLock } from "react-icons/fi";
import "react-toastify/dist/ReactToastify.css";

const AdminLogin = () => {
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        const navigate = useNavigate();


        const navigateToLogin = () => {
            navigate("/login"); // Navigate to Admin Login page
          };
      
        const handleLogin = async (e) => {
          e.preventDefault();
      
          try {
            const response = await axios.post("http://localhost:5000/api/users/adminLogin", { email, password });
            const { token, message } = response.data;
      
            if (!token) throw new Error("No token received from server.");
      
            localStorage.setItem("authData", JSON.stringify({ token, message }));
      
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            console.log("Decoded Token:", decodedToken);
            console.log(decodedToken.role, "role");
      
            if (decodedToken.role === "Admin") {
              toast.success("Welcome Admin!");
              navigate("/dashboard");
            } else {
              toast.success("Welcome Customer!");
              navigate("/home");
            }
          } catch (error) {
            console.error("Login error:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || "Login failed. Please check your credentials.");
          }
        };

  return (
    <div className="flex">
    {/* Left Side - Login Form */}
    <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white p-12">
      <div className="">
        <h2 className="text-3xl font-bold text-center text-brown-700">Welcome Back!</h2>
        <p className="text-gray-500 text-center mb-6">Enter your credentials to access your account</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-600 transition"
            />

          </div>

          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-600 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-700 text-white py-2 rounded-lg hover:bg-brown-800 transition duration-300 ease-in-out"
          >
            Login
          </button>
        </form>
        <p className="text-center text-gray-500 mt-2">
            Are you a customer?{" "}
            <button
              onClick={navigateToLogin} // Call navigateToAdminLogin function on click
              className="text-red-700 font-semibold hover:underline"
            >
              Login as Customer
            </button>
            </p>
        
      </div>
    </div>

    {/* Right Side - Image */}
    <div className="hidden md:block md:w-1/2 bg-cover bg-center bg-[url('/img/Login.png')] h-screen ">

      <ToastContainer />
    </div>
    </div>
  )
}

export default AdminLogin;