const express = require('express');
const { getAllTemperatures, addFullCustomProduct } = require('../controllers/customProductController');

const router = express.Router();

router.get('/temperature', getAllTemperatures)
router.post("/customProducts", addFullCustomProduct);


module.exports = router;

