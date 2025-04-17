const express = require("express");
const { verifyKhaltiPayment } = require("../controllers/paymentController");

const router = express.Router();

router.post("/verify-payment", verifyKhaltiPayment);

module.exports = router;
