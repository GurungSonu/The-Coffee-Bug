// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import KhaltiCheckout from "khalti-checkout-web";
// import getKhaltiConfig from "../../KhaltiConfig";

// const Checkout = () => {
//   const [deliveryMethod, setDeliveryMethod] = useState("Delivery");
//   const [paymentMethod, setPaymentMethod] = useState("Cash On Delivery");
//   const [deliveryAddress, setDeliveryAddress] = useState("");

//   const authData = JSON.parse(localStorage.getItem("authData"));
//   const userID = authData?.userId;
//   const token = authData?.token;
//   const navigate = useNavigate();

//   const handlePlaceOrder = async () => {
//     try {
//       const response = await axios.post(
//         "http://localhost:5000/api/order/orders/checkout",
//         {
//           userID,
//           deliveryMethod,
//           paymentMethod,
//           deliveryAddress: deliveryMethod === "Delivery" ? deliveryAddress : null,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       const { masterOrderID, grandTotal } = response.data;
//       console.log("🧾 Order Response:", response.data);

//       if (!masterOrderID || !grandTotal) {
//         console.error("❌ Missing masterOrderID or grandTotal:", response.data);
//         toast.error("Something went wrong during order processing.");
//         return;
//       }

//       if (paymentMethod === "Online Payment") {
//         console.log("🚀 Starting Khalti with Order ID:", masterOrderID);

//         const khaltiConfig = getKhaltiConfig(navigate, masterOrderID);
//         const checkout = new KhaltiCheckout(khaltiConfig);
//         checkout.show({ amount: grandTotal * 100 }); // Amount in paisa
//       } else {
//         toast.success("✅ Order placed with Cash on Delivery!");
//         navigate("/orderList");
//       }
//     } catch (err) {
//       console.error("❌ Order failed:", err);
//       toast.error("Failed to place order.");
//     }
//   };

//   return (
//     <div className="p-6 max-w-md mx-auto bg-white rounded shadow">
//       <h2 className="text-xl font-bold mb-4">Checkout</h2>

//       {/* Delivery Method */}
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

//       {/* Delivery Address */}
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

//       {/* Payment Method */}
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

//       {/* Place Order */}
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


import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Checkout = () => {
  const [deliveryMethod, setDeliveryMethod] = useState("Delivery");
  const [paymentMethod, setPaymentMethod] = useState("Cash On Delivery");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const navigate = useNavigate();

  const authData = JSON.parse(localStorage.getItem("authData"));
  const userID = authData?.userId;
  const token = authData?.token;

  const handlePlaceOrder = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/order/orders/checkout", {
        userID,
        deliveryMethod,
        paymentMethod,
        deliveryAddress: deliveryMethod === "Delivery" ? deliveryAddress : null,
      });

      const { masterOrderID, grandTotal } = res.data;
      console.log("🧾 Order Response:", res.data);

      if (paymentMethod === "Online Payment") {
        console.log("🚀 Starting Khalti with Order ID:", masterOrderID);

        // Initiate payment via your backend
        // const initRes = await axios.post("https://dev.khalti.com/api/v2/epayment/initiate/", {
        //   return_url: "http://localhost:5173/orderList",
        //   website_url: "http://localhost:5173",
        //   amount: Math.round(grandTotal * 100),
        //   purchase_order_id: `ORD-${masterOrderID}`,
        //   purchase_order_name: "CoffeeBug Order",
        //   customer_info: {
        //     name: authData.name || "Test User",
        //     email: authData.email || "test@example.com",
        //     phone: authData.phone || "9800000001"
        //   }
        // }, {
        //   headers: {
        //     Authorization: "Key c90ee672cb4d43b79da7f220c2c2ca1a", // Live Secret Key (for sandbox)
        //     "Content-Type": "application/json"
        //   }
        // });

        const initRes = await axios.post("http://localhost:5000/api/payment/initiate-payment", {
          orderId: masterOrderID,
          amount: grandTotal,
          user: {
            name: authData.name,
            email: authData.email,
            phone: authData.phone
          }
        });
        
        
        const { payment_url } = initRes.data;
        window.location.href = payment_url;
      } else {
        toast.success("✅ Order placed with Cash on Delivery!");
        navigate("/orderList");
      }

    } catch (err) {
      console.error("❌ Error placing order or initiating payment:", err.response?.data || err.message);
      toast.error("Failed to complete checkout.");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Checkout</h2>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Delivery Method</label>
        <select
          value={deliveryMethod}
          onChange={(e) => setDeliveryMethod(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        >
          <option>Delivery</option>
          <option>Pickup</option>
        </select>
      </div>

      {deliveryMethod === "Delivery" && (
        <div className="mb-4">
          <label className="block mb-1 font-medium">Delivery Address</label>
          <textarea
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter delivery address"
          />
        </div>
      )}

      <div className="mb-4">
        <label className="block mb-1 font-medium">Payment Method</label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="Cash On Delivery">Cash On Delivery</option>
          <option value="Online Payment">Online Payment (Khalti)</option>
        </select>
      </div>

      <button
        onClick={handlePlaceOrder}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        {paymentMethod === "Online Payment" ? "Pay with Khalti" : "Place Order"}
      </button>
    </div>
  );
};

export default Checkout;
