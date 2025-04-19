import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Checkout = () => {
  const [deliveryMethod, setDeliveryMethod] = useState("Delivery");
  const [paymentMethod, setPaymentMethod] = useState("Cash On Delivery");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const authData = JSON.parse(localStorage.getItem("authData"));
  const userID = authData?.userId;
  const token = authData?.token;
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    if (!userID) {
      toast.error("Please login first");
      return;
    }

    try {
      if (paymentMethod === "Online Payment") {
        // Save checkout info for later (in KhaltiSuccess)
        localStorage.setItem("pendingCheckout", JSON.stringify({
          userID,
          deliveryMethod,
          paymentMethod,
          deliveryAddress
        }));
        

        // Estimate total from backend (or set manually)
        const totalRes = await axios.get(`http://localhost:5000/api/payment/estimate-total/${userID}`);
        const grandTotal = totalRes.data?.grandTotal;

        if (!grandTotal) {
          toast.error("Failed to calculate total.");
          return;
        }

        const res = await axios.post("http://localhost:5000/api/payment/initiate-payment", {
          orderId: Date.now(), // temp ID
          amount: grandTotal,
          user: {
            name: authData.name,
            email: authData.email,
            phone: authData.phone
          }
        });
        

        window.location.href = res.data.payment_url;
      } else {
        // For Cash On Delivery: place order immediately
        const res = await axios.post("http://localhost:5000/api/order/orders/checkout", {
          userID,
          deliveryMethod,
          paymentMethod,
          deliveryAddress
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        toast.success("✅ Order placed with Cash on Delivery!");
        navigate("/orderList");
      }
    } catch (err) {
      console.error("❌ Checkout error:", err.response?.data || err.message);
      toast.error("Failed to complete checkout.");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Checkout</h2>

      <label className="block mb-1">Delivery Method</label>
      <select
        value={deliveryMethod}
        onChange={(e) => setDeliveryMethod(e.target.value)}
        className="mb-4 w-full border px-3 py-2 rounded"
      >
        <option value="Delivery">Delivery</option>
        <option value="Pickup">Pickup</option>
      </select>

      {deliveryMethod === "Delivery" && (
        <textarea
          placeholder="Delivery Address"
          value={deliveryAddress}
          onChange={(e) => setDeliveryAddress(e.target.value)}
          className="mb-4 w-full border px-3 py-2 rounded"
        />
      )}

      <label className="block mb-1">Payment Method</label>
      <select
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
        className="mb-4 w-full border px-3 py-2 rounded"
      >
        <option value="Cash On Delivery">Cash On Delivery</option>
        <option value="Online Payment">Online Payment (Khalti)</option>
      </select>

      <button
        onClick={handlePlaceOrder}
        className="w-full bg-green-600 text-white py-2 rounded"
      >
        {paymentMethod === "Online Payment" ? "Pay with Khalti" : "Place Order"}
      </button>
    </div>
  );
};

export default Checkout;



// rati ko changes
// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

// const Checkout = () => {
//   const [deliveryMethod, setDeliveryMethod] = useState("Delivery");
//   const [paymentMethod, setPaymentMethod] = useState("Cash On Delivery");
//   const [deliveryAddress, setDeliveryAddress] = useState("");

//   const authData = JSON.parse(localStorage.getItem("authData"));
//   const userID = authData?.userId;
//   const token = authData?.token;
//   const navigate = useNavigate();

//   const handlePlaceOrder = async () => {
//     if (!userID) return toast.error("Please login first");

//     if (paymentMethod === "Cash On Delivery") {
//       try {
//         const res = await axios.post("http://localhost:5000/api/order/orders/checkout", {
//           userID,
//           deliveryMethod,
//           paymentMethod,
//           deliveryAddress
//         }, {
//           headers: { Authorization: `Bearer ${token}` }
//         });

//         toast.success("✅ Order placed with Cash on Delivery!");
//         navigate("/orderList");
//       } catch (err) {
//         console.error("❌ COD error:", err);
//         toast.error("Failed to place order.");
//       }
//     } else {
//       try {
//         const res = await axios.post("http://localhost:5000/api/payment/initiate-payment", {
//           userID,
//           amount: 500, // Set dynamically in real case
//         });

//         window.location.href = res.data.payment_url;
//       } catch (err) {
//         console.error("❌ Khalti Error:", err);
//         toast.error("Failed to start payment.");
//       }
//     }
//   };

//   return (
//     <div className="p-6 max-w-md mx-auto bg-white rounded shadow">
//       <h2 className="text-xl font-bold mb-4">Checkout</h2>

//       <label className="block mb-1">Delivery Method</label>
//       <select
//         value={deliveryMethod}
//         onChange={(e) => setDeliveryMethod(e.target.value)}
//         className="mb-4 w-full border px-3 py-2 rounded"
//       >
//         <option value="Delivery">Delivery</option>
//         <option value="Pickup">Pickup</option>
//       </select>

//       {deliveryMethod === "Delivery" && (
//         <textarea
//           placeholder="Delivery Address"
//           value={deliveryAddress}
//           onChange={(e) => setDeliveryAddress(e.target.value)}
//           className="mb-4 w-full border px-3 py-2 rounded"
//         />
//       )}

//       <label className="block mb-1">Payment Method</label>
//       <select
//         value={paymentMethod}
//         onChange={(e) => setPaymentMethod(e.target.value)}
//         className="mb-4 w-full border px-3 py-2 rounded"
//       >
//         <option value="Cash On Delivery">Cash On Delivery</option>
//         <option value="Online Payment">Online Payment (Khalti)</option>
//       </select>

//       <button
//         onClick={handlePlaceOrder}
//         className="w-full bg-green-600 text-white py-2 rounded"
//       >
//         {paymentMethod === "Online Payment" ? "Pay with Khalti" : "Place Order"}
//       </button>
//     </div>
//   );
// };

// export default Checkout;


// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

// const Checkout = () => {
//   const [deliveryMethod, setDeliveryMethod] = useState("Delivery");
//   const [paymentMethod, setPaymentMethod] = useState("Cash On Delivery");
//   const [deliveryAddress, setDeliveryAddress] = useState("");

//   const authData = JSON.parse(localStorage.getItem("authData"));
//   const userID = authData?.userId;
//   const token = authData?.token;

//   const navigate = useNavigate();

//   const handlePlaceOrder = async () => {
//     if (!userID) {
//       toast.error("Login required");
//       return navigate("/login");
//     }

//     try {
//       if (paymentMethod === "Cash On Delivery") {
//         // ✅ Create order immediately for COD
//         const res = await axios.post("http://localhost:5000/api/order/orders/checkout", {
//           userID,
//           deliveryMethod,
//           paymentMethod,
//           deliveryAddress: deliveryMethod === "Delivery" ? deliveryAddress : null
//         }, {
//           headers: { Authorization: `Bearer ${token}` }
//         });

//         toast.success("✅ Order placed with Cash On Delivery!");
//         navigate("/orderList");
//       } else {
//         // 🕓 Defer order creation until payment is verified
//         // ➕ Get estimated grandTotal only
//         const priceRes = await axios.get(`http://localhost:5000/api/order/estimate-total/${userID}`);
//         const grandTotal = priceRes.data?.grandTotal;

//         if (!grandTotal) {
//           toast.error("Cart is empty or error estimating total");
//           return;
//         }

//         // 🔁 Send to backend to initiate Khalti
//         const initRes = await axios.post("http://localhost:5000/api/payment/initiate-payment", {
//           orderId: Date.now(), // temporary unique ID, must match later
//           amount: grandTotal,
//           userID
//         });

//         const { payment_url } = initRes.data;
//         window.location.href = payment_url;
//       }
//     } catch (err) {
//       console.error("❌ Checkout error:", err);
//       toast.error("Failed to complete checkout");
//     }
//   };


  

//   return (
//     <div className="p-6 max-w-md mx-auto bg-white rounded shadow">
//       <h2 className="text-xl font-bold mb-4">Checkout</h2>

//       <div className="mb-4">
//         <label className="block mb-1 font-medium">Delivery Method</label>
//         <select
//           value={deliveryMethod}
//           onChange={(e) => setDeliveryMethod(e.target.value)}
//           className="w-full border px-3 py-2 rounded"
//         >
//           <option value="Delivery">Delivery</option>
//           <option value="Pickup">Pickup</option>
//         </select>
//       </div>

//       {deliveryMethod === "Delivery" && (
//         <div className="mb-4">
//           <label className="block mb-1 font-medium">Delivery Address</label>
//           <textarea
//             value={deliveryAddress}
//             onChange={(e) => setDeliveryAddress(e.target.value)}
//             className="w-full border px-3 py-2 rounded"
//             placeholder="Enter delivery address"
//           />
//         </div>
//       )}

//       <div className="mb-4">
//         <label className="block mb-1 font-medium">Payment Method</label>
//         <select
//           value={paymentMethod}
//           onChange={(e) => setPaymentMethod(e.target.value)}
//           className="w-full border px-3 py-2 rounded"
//         >
//           <option value="Cash On Delivery">Cash On Delivery</option>
//           <option value="Online Payment">Online Payment (Khalti)</option>
//         </select>
//       </div>

//       <button
//         onClick={handlePlaceOrder}
//         className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
//       >
//         {paymentMethod === "Online Payment" ? "Pay with Khalti" : "Place Order"}
//       </button>
//     </div>
//   );
// };

// export default Checkout;
