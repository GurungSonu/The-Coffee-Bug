const express = require("express");
const { initiateKhaltiPayment } = require("../controllers/paymentController");

const router = express.Router();

router.post("/initiate-payment", initiateKhaltiPayment);

module.exports = router;
