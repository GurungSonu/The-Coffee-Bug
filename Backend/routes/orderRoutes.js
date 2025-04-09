const express = require('express');
const { createOrder, getOrderHistory, updateOrderStatus } = require('../controllers/orderController');
const { getOrderDetails } = require('../controllers/OrderController');

const router = express.Router();

router.post('/create', createOrder);
router.get('/history/:userID', getOrderHistory);
router.put('/orderStatus/:orderID', updateOrderStatus);
router.get('/orderDetails/:orderID', getOrderDetails)
module.exports = router;
