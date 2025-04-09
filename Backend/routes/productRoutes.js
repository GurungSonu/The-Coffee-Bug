const express = require('express');
const { 
  createProduct, 
  getAllProducts, 
  getProductById, 
  updateProduct, 
  deleteProduct, 
  isAdmin } = require('../controllers/productController');
const { getCategories } = require('../controllers/productController');
const {addProductToCart} = require('../controllers/cartController');
const {getCartItems} = require('../controllers/cartController');
const { authenticateToken } = require('../controllers/userController');

const multer = require('multer');
const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Set upload destination


router.get('/categories', getCategories); 
// Route to get all products
router.get('/allProducts', getAllProducts);  // Get all products
router.post('/addToCart', addProductToCart );
// Route to get a single product by ID (optional, based on your needs)
router.get('/:id', getProductById); // Get product by ID

// Admin-only route to create a new product
router.post('/create', authenticateToken, isAdmin, upload.single('image'), createProduct);

// Admin-only route to update an existing product
router.put('/update/:id', authenticateToken, isAdmin, updateProduct);

// Admin-only route to delete a product
router.delete('/delete/:id', authenticateToken, isAdmin, deleteProduct);
router.get('/cart/:userID', getCartItems);




module.exports = router;
