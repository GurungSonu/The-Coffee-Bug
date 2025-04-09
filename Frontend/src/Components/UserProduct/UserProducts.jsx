import React from "react";
import  { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const UserProducts = () => {
  
  const [products, setProducts] = useState([]);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const authData = localStorage.getItem("authData");
        const parsedData = JSON.parse(authData); // Parse stored JSON
        const token = parsedData.token;
        if (!token) {
          toast.error("Unauthorized! Please log in.");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/products/allProducts", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProducts(response.data);
        console.log("Products:", response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products.");
      }
    };

    fetchProducts();
  }, []);

 
  // const handleAddToCart = async () => {
  //   const authData = localStorage.getItem("authData");
  //   const parsedData = JSON.parse(authData); // Get user info from localStorage
  //   const userID = parsedData?.userID; // Assuming userID is saved in localStorage
  //   const productID = product.ProductID;
  //   const productPrice = product.ProductPrice;

  //   if (!userID) {
  //     toast.error("Please log in to add items to your cart.");
  //     return;
  //   }

  //   try {
  //     const response = await axios.post('http://localhost:5000/api/products/addToCart', {
  //       userID,
  //       productID,
  //       quantity,
  //       productPrice,
  //     });

  //     toast.success(response.data.message); // Show success message
  //   } catch (error) {
  //     console.error("Error adding product to cart:", error);
  //     toast.error("Failed to add product to cart.");
  //   }
  // };

  const handleAddToCart = async (product) => {
    const authData = localStorage.getItem("authData");
    const parsedData = JSON.parse(authData); // Get user info from localStorage
    const token = parsedData.token;
    console.log(parsedData.userId);
    const userID = parsedData?.userId; // Assuming userID is saved in localStorage
    const productID = product.ProductID;
    
    const productPrice = product.ProductPrice;
    

    const quantity = 1; // You can add quantity logic if needed
    console.log(userID)
    if (!userID) {
      toast.error("Please log in to add items to your cart.");
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/products/addToCart', // URL
        { // Request body (data)
            userID,
            productID,
            productPrice,
            quantity,
        },
        { // Config (headers)
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    

      toast.success(response.data.message); // Show success message
    } catch (error) {
      console.error("Error adding product to cart:", error);
      toast.error("Failed to add product to cart.");
    }
  };

  

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Available Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.ProductID} className="bg-white p-4 shadow-md rounded-lg">
            {console.log(`/img/${product.Image}`)}
            <img src={`/img/${product.Image}`} alt={product.ProductName} className="w-full h-40 object-cover rounded-md" />
            <h3 className="text-xl font-semibold mt-2">{product.ProductName}</h3>
            <p className="text-gray-600">{product.ProductDescription}</p>
            <p className="text-gray-900 font-bold mt-2">Rs {product.ProductPrice}</p>
            <button onClick={() => handleAddToCart(product)}>add to cart</button>
            {/* <button onClick={handleGetCartItems}>Get cart item </button> */}
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default UserProducts;
