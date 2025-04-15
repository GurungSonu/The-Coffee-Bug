import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; // ⬅️ Add this

const MainCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const authData = JSON.parse(localStorage.getItem("authData"));
  const token = authData?.token;
  const userID = authData?.userId;

  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/products/cart/${userID}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to load cart items.");
    }
  };

  const handleQuantityChange = async (item, change) => {
    const newQty = item.Quantity + change;
    if (newQty < 1) return;

    const isCustom = item.Source === "custom";
    const itemID = isCustom ? item.CustomProductID : item.ProductID;

    // For standard products use ProductPrice; for custom use LineTotal
    const unitPrice = isCustom
      ? parseFloat(item.LineTotal) / item.Quantity
      : item.ProductPrice;

    if (!itemID || isNaN(unitPrice)) {
      toast.error("Missing item details for update.");
      console.warn("Update failed: missing itemID or unitPrice", item);
      return;
    }

    try {
      await axios.put("http://localhost:5000/api/products/cart/update", {
        userID,
        itemID,
        quantity: newQty,
        productPrice: unitPrice,
        itemType: isCustom ? "custom" : "main",
        cartStatus: "active"
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchCartItems();
      toast.success("Cart updated!");

    } catch (err) {
      console.error("Update error:", err.response?.data || err.message);
      toast.error("Failed to update cart item.");
    }
  };




  const handleDelete = async (item) => {
    const id = item.Source === "main" ? item.ProductID : item.CustomProductID;
    try {
      await axios.delete(`http://localhost:5000/api/products/cart/delete/${userID}/${id}/${item.Source}`, {
        headers: { Authorization: `Bearer ${token}` }
      });


      fetchCartItems();
      toast.success("Item removed from cart.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete item.");
    }
  };

  const itemCount = cartItems.reduce((acc, item) => acc + item.Quantity, 0);
  const subTotal = cartItems.reduce((acc, item) => acc + parseFloat(item.LineTotal), 0);
  const discount = 10;
  const total = subTotal - discount;

  const handleCheckout = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/order/orders/checkout", {
        userID
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("Order placed successfully!");
      fetchCartItems(); // Optionally refresh or clear UI
      console.log("Order response:", response.data);
      navigate("/orderList"); // If using React Router
    } catch (error) {
      console.error("Checkout failed:", error.response?.data || error.message);
      toast.error("Failed to place order.");
    }
  };


  //   return (
  //     <div className="product-cart-container p-6">
  //       <h2 className="text-2xl font-bold mb-4">Your Cart</h2>

  //       {cartItems.length > 0 ? (
  //         cartItems.map((item, idx) => (
  //           <div
  //             key={idx}
  //             className="cart-item border p-4 mb-4 rounded flex justify-between items-center"
  //           >
  //             <div className="flex items-center gap-4">
  //               {item.Source === "main" && item.Image ? (
  //                 <img
  //                   src={`/img/${item.Image}`}
  //                   alt={item.ProductName}
  //                   className="w-20 h-20 object-cover rounded"
  //                 />
  //               ) : (
  //                 <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center text-gray-500">
  //                   No Image
  //                 </div>
  //               )}
  //               <div>
  //                 <h3 className="font-semibold">{item.ProductName}</h3>
  //                 <p>Price: Rs{item.Source === "custom"
  //                   ? (parseFloat(item.LineTotal) / item.Quantity).toFixed(2)
  //                   : item.ProductPrice
  //                 }</p>
  //                 <p>Total: Rs{item.LineTotal}</p>
  //               </div>

  //             </div>
  //             <div className="flex items-center gap-3">
  //               <button onClick={() => handleQuantityChange(item, -1)} className="bg-blue-500 text-white px-2 py-1 rounded">-</button>
  //               <span>{item.Quantity}</span>
  //               <button onClick={() => handleQuantityChange(item, 1)} className="bg-green-500 text-white px-2 py-1 rounded">+</button>
  //               <button onClick={() => handleDelete(item)} className="bg-red-500 text-white px-3 py-1 rounded">🗑</button>
  //             </div>
  //           </div>
  //         ))
  //       ) : (
  //         <p>Your cart is empty.</p>
  //       )}
  //     </div>
  //   );
  // };

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-6">
      {/* LEFT: Cart Items */}
      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>

        {cartItems.length > 0 ? (
          cartItems.map((item, idx) => (
            <div
              key={idx}
              className="cart-item border p-4 mb-4 rounded flex justify-between items-center"
            >
              <div className="flex items-center gap-4">
                {item.Source === "main" && item.Image ? (
                  <img
                    src={`/img/${item.Image}`}
                    alt={item.ProductName}
                    className="w-20 h-20 object-cover rounded"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
                <div>
                  <h3 className="font-semibold">{item.ProductName}</h3>
                  <p>Price: Rs{item.Source === "custom"
                    ? (parseFloat(item.LineTotal) / item.Quantity).toFixed(2)
                    : item.ProductPrice
                  }</p>
                  <p>Total: Rs{item.LineTotal}</p>
                </div>

              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => handleQuantityChange(item, -1)} className="bg-blue-500 text-white px-2 py-1 rounded">-</button>
                <span>{item.Quantity}</span>
                <button onClick={() => handleQuantityChange(item, 1)} className="bg-green-500 text-white px-2 py-1 rounded">+</button>
                <button onClick={() => handleDelete(item)} className="bg-red-500 text-white px-3 py-1 rounded">🗑</button>
              </div>
            </div>
          ))
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>

      {/* RIGHT: Order Summary */}
      <div className="w-full lg:w-80 border rounded p-6 shadow-md bg-white">
        <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
        <div className="flex justify-between mb-2">
          <span>Items</span>
          <span>{itemCount}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Sub Total</span>
          <span>Rs{subTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Shipping</span>
          <span>Rs0.00</span>
        </div>

        <hr className="my-3" />
        <div className="flex justify-between font-bold text-lg mb-4">
          <span>Total</span>
          <span>Rs{total.toFixed(2)}</span>
        </div>
        <button
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
          onClick={handleCheckout}
        >
          Proceed to Checkout
        </button>

      </div>
    </div>
  );
};

export default MainCart;
