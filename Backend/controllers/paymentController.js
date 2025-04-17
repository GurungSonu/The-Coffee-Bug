const axios = require("axios");

const verifyKhaltiPayment = async (req, res) => {
  const { token, amount, orderId } = req.body;

  if (!token || !amount || !orderId) {
    return res.status(400).json({ message: "Missing token, amount, or order ID" });
  }

  try {
    const khaltiResponse = await axios.post(
      "https://khalti.com/api/v2/payment/verify/",
      { token, amount },
      {
        headers: {
          Authorization: "c90ee672cb4d43b79da7f220c2c2ca1a",
        },
      }
    );

    if (khaltiResponse.data && khaltiResponse.data.idx) {
      // ✅ Update payment status in your DB
      const updateQuery = `UPDATE MasterOrder SET PaymentStatus = 'Paid' WHERE MasterOrderID = ?`;
      pool.query(updateQuery, [orderId], (err, result) => {
        if (err) {
          console.error("❌ Error updating payment status:", err);
          return res.status(500).json({ message: "Failed to update order status" });
        }
        res.status(200).json({ message: "Payment verified and order updated!" });
      });
    } else {
      res.status(400).json({ message: "Invalid payment verification response" });
    }
  } catch (err) {
    console.error("❌ Khalti verify error:", err.response?.data || err.message);
    res.status(500).json({ message: "Khalti verification failed" });
  }
};

module.exports = { verifyKhaltiPayment };
