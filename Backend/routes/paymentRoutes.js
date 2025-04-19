const express = require("express");
const router = express.Router();

const {
  initiateKhaltiPayment,
  lookupKhaltiPayment,
  verifyKhaltiPayment,
  estimateOrderTotal
} = require("../controllers/paymentController");

router.post("/initiate-payment", initiateKhaltiPayment);
router.post("/lookup-payment", lookupKhaltiPayment);
router.post("/verify-payment", verifyKhaltiPayment);
router.get("/estimate-total/:userID", estimateOrderTotal); // ✅ new route


module.exports = router;
