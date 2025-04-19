// src/KhaltiConfig.js
import axios from "axios";
import { toast } from "react-toastify";

const getKhaltiConfig = (navigate, orderId) => ({
  publicKey: "test_public_key_f48d200bfb964e6e8ace8bc1ff7c2c15", 
  productIdentity: orderId,
  productName: "Coffee Order",
  productUrl: "http://localhost:5173", // Change for production
  eventHandler: {
    onSuccess: async (payload) => {
      try {
        await axios.post("http://localhost:5000/api/payment/verify-payment", {
          token: payload.token,
          amount: payload.amount,
          orderId: orderId,
        });
        toast.success("✅ Payment successful!");
        navigate("/orderList");
      } catch (err) {
        console.error("❌ Payment verification failed:", err);
        toast.error("Payment verification failed.");
      }
    },
    onError: (error) => {
      console.error("Payment Error:", error);
      toast.error("Payment was not successful.");
    },
    onClose: () => {
      console.log("Widget closed.");
    },
  },
});

export default getKhaltiConfig;
