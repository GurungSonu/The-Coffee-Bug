const axios = require("axios");

const initiateKhaltiPayment = async (req, res) => {
  const { orderId, amount, user } = req.body;

  console.log("🛠️ Initiating Khalti Payment with:", {
    orderId,
    amount,
    user
  });

  try {
    const khaltiRes = await axios.post(
      "https://dev.khalti.com/api/v2/epayment/initiate/",
      {
        return_url: "http://localhost:5173/orderList",
        website_url: "http://localhost:5173",
        amount: Math.round(amount * 100),
        purchase_order_id: `ORD-${orderId}`,
        purchase_order_name: "CoffeeBug Order",
        customer_info: {
          name: user?.name || "Test User",
          email: user?.email || "test@example.com",
          phone: user?.phone || "9800000001"
        }
      },
      {
        headers: {
          Authorization: "Key c90ee672cb4d43b79da7f220c2c2ca1a", // sandbox secret key
          "Content-Type": "application/json"
        }
      }
    );

    console.log("✅ Khalti INIT response:", khaltiRes.data);
    res.status(200).json(khaltiRes.data);
  } catch (err) {
    console.error("❌ Khalti INIT Error:", err.response?.data || err.message);
    res.status(500).json({ message: "Failed to initiate Khalti payment" });
  }
};

module.exports = { initiateKhaltiPayment };
