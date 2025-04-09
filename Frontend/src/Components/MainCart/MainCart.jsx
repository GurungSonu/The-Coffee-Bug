import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const MainCart = ({ product }) => {
//   const [quantity, setQuantity] = useState(1);
  const [cartItems, setCartItems] = useState([]);

  // Fetch cart items when the component loads
  useEffect(() => {
    const fetchCartItems = async () => {
      // Get userID from localStorage
      const authData = localStorage.getItem("authData");
      const parsedData = JSON.parse(authData);
      const token = parsedData.token;
      const userID = parsedData?.userId;

      if (!userID) {
        toast.error("Please log in to view your cart.");
        return;
      }

      try {
        // Make the GET request to fetch cart items
        const response = await axios.get(`http://localhost:5000/api/products/cart/${userID}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Store fetched cart items in state
        setCartItems(response.data);
        console.log("Cart Items:", response.data);
      } catch (error) {
        console.error("Error fetching cart items:", error);
        toast.error("Failed to fetch cart items.");
      }
    };

    fetchCartItems();
  }, []);  // Empty dependency array to call once when the component mounts

  return (
    <div className="product-cart-container">
      <h2>Your Cart</h2>
      
      {cartItems.length > 0 ? (
        cartItems.map((item) => (
          <div key={item.ProductID} className="cart-item">
            <img
              src={`../../../public/img/${item.Image}`} // Ensure image path is correct
              alt={item.ProductName}
            />
            <h3>{item.ProductName}</h3>
            <p>Quantity: {item.Quantity}</p>
            <p>Price: Rs{item.ProductPrice}</p>
            <p>Total: Rs{item.LineTotal}</p>
          </div>
        ))
      ) : (
        <p>Your cart is empty.</p>
      )}

      {/* <div className="product-card">
        <img src={`../../../public/img/${product.Image}`} alt={product.ProductName} />
        <h3>{product.ProductName}</h3>
        <p>{product.ProductDescription}</p>
        <p>${product.ProductPrice}</p>

        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          min="1"
          className="quantity-input"
        />
        <button onClick={handleAddToCart}>Add to Cart</button> */}
      {/* </div> */}
    </div>
  );
};

export default MainCart;
