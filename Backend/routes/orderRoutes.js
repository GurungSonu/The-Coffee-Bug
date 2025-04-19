const express = require('express');
const { createCombinedOrder } = require('../controllers/OrderController');
// const { getMasterOrderDetails } = require('../controllers/OrderController');
const { getMasterOrdersByUser } = require('../controllers/OrderController');
const { getMasterOrderDetails } = require('../controllers/OrderController');
// const { createOrder, getOrderHistory, updateOrderStatus } = require('../controllers/orderController');
// const { getOrderDetails } = require('../controllers/OrderController');
// const { createCombinedOrder } = require('../controllers/OrderController');
const adminDeliveryController = require('../controllers/OrderController')
const router = express.Router();

// router.post('/create', createOrder);
// router.get('/history/:userID', getOrderHistory);
// router.put('/orderStatus/:orderID', updateOrderStatus);
// router.get('/orderDetails/:orderID', getOrderDetails)
router.post("/orders/checkout", createCombinedOrder); // Make sure this route is registered
router.get('/history/:userID', getMasterOrdersByUser);

// Get detailed view of one order
router.get("/details/:masterOrderID", getMasterOrderDetails);

// admin ko lagi
router.get("/admin/orders", adminDeliveryController.getAllOrders);

// ✅ PUT update order status
router.put("/admin/orders/:masterOrderID/status", adminDeliveryController.updateOrderStatus);
module.exports = router;
