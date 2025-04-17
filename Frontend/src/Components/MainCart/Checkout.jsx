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
//     try {
//       const res = await axios.post("http://localhost:5000/api/order/orders/checkout", {
//         userID,
//         deliveryMethod,
//         paymentMethod,
//         deliveryAddress
//       }, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       toast.success("Order placed successfully!");
//       navigate("/orderList");
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to place order.");
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
//           <option>Delivery</option>
//           <option>Pickup</option>
//         </select>
//       </div>

//       <div className="mb-4">
//         <label className="block mb-1 font-medium">Payment Method</label>
//         <select
//           value={paymentMethod}
//           onChange={(e) => setPaymentMethod(e.target.value)}
//           className="w-full border px-3 py-2 rounded"
//         >
//           <option>Cash On Delivery</option>
//           <option>Online Payment</option>
//         </select>
//       </div>

//       {deliveryMethod === "Delivery" && (
//   <div className="mb-4">
//     <label className="block mb-1 font-medium">Delivery Address</label>
//     <textarea
//       value={deliveryAddress}
//       onChange={(e) => setDeliveryAddress(e.target.value)}
//       className="w-full border px-3 py-2 rounded"
//       placeholder="Enter delivery address"
//     />
//   </div>
// )}
//       <button
//         onClick={handlePlaceOrder}
//         className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
//       >
//         Place Order
//       </button>
//     </div>
//   );
// };

// export default Checkout;


import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import KhaltiCheckout from "khalti-checkout-web";
import khaltiBaseConfig from "../../KhaltiConfig"; // ✅ Confirm path

const Checkout = () => {
  const [deliveryMethod, setDeliveryMethod] = useState("Delivery");
  const [paymentMethod, setPaymentMethod] = useState("Cash On Delivery");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const authData = JSON.parse(localStorage.getItem("authData"));
  const userID = authData?.userId;
  const token = authData?.token;
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/order/orders/checkout", {
        userID,
        deliveryMethod,
        paymentMethod,
        deliveryAddress: deliveryMethod === "Delivery" ? deliveryAddress : null
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const { masterOrderID, grandTotal } = res.data;

      if (paymentMethod === "Online Payment") {
        const khaltiConfig = {
          ...khaltiBaseConfig,
          eventHandler: {
            onSuccess: async (payload) => {
              try {
                await axios.post("http://localhost:5000/api/payment/verify-payment", {
                  token: payload.token,
                  amount: payload.amount,
                  orderId: masterOrderID
                });

                toast.success("✅ Payment verified and order confirmed!");
                navigate("/orderList");
              } catch (err) {
                console.error("❌ Payment verification failed:", err);
                toast.error("Payment verification failed.");
              }
            },
            onError: (error) => {
              console.error("❌ Khalti Payment Error", error);
              toast.error("Khalti payment failed.");
            },
            onClose: () => {
              console.log("🛑 Khalti widget closed.");
            }
          }
        };

        const khaltiCheckout = new KhaltiCheckout(khaltiConfig);
        khaltiCheckout.show({ amount: grandTotal * 100 }); // convert to paisa
      } else {
        toast.success("✅ Order placed with Cash on Delivery!");
        navigate("/orderList");
      }

    } catch (err) {
      console.error("❌ Order failed:", err);
      toast.error("Failed to place order.");
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
          <option value="Delivery">Delivery</option>
          <option value="Pickup">Pickup</option>
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

