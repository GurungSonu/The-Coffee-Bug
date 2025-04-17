// src/config/KhaltiConfig.js
import axios from "axios";
import { toast } from "react-toastify";

const getKhaltiConfig = (navigate, orderId) => ({
  publicKey: "c90ee672cb4d43b79da7f220c2c2ca1a", // Replace with real publicKey
  productIdentity: orderId,
  productName: "Coffee Order",
  productUrl: "http://localhost:5173",
  eventHandler: {
    onSuccess: async (payload) => {
      try {
        const res = await axios.post("http://localhost:5000/api/payment/verify-payment", {
          token: payload.token,
          amount: payload.amount,
          orderId: orderId, // You pass this in from your Checkout.jsx
        });

        toast.success("✅ Payment successful!");
        navigate("/orderList");
      } catch (err) {
        console.error("❌ Payment verification failed:", err);
        toast.error("Payment verification failed.");
      }
    },
    onError: (error) => {
      console.log("Payment Error:", error);
      toast.error("Payment was not successful.");
    },
    onClose: () => {
      console.log("Widget closed.");
    }
  }
});

export default getKhaltiConfig;
