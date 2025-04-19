const express = require('express');
const { getAllUsers, getUserById, createUser, loginUser, logoutUser, updateUser, deleteUser, deactivateUser, restoreUser, updateUserStatus, loginAdmin, checkEmailOrPhone } = require('../controllers/userController');
// const { getCartItems } = require('../controllers/cartController');
// const { default: Login } = require('../../Frontend/src/Components/LoginPage/Login');
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// User routes
router.get('/', getAllUsers); // Get all users

router.post('/createUser',upload.single("profileImage"), createUser); // Create new user
// router.delete('/deleteUser/:id', deleteUser); // Create new user
router.post('/updateUser', updateUser); // Create new user
router.post('/login', loginUser); // Login user
router.post('/adminLogin', loginAdmin);
router.post('/logout', logoutUser); // Logout user
// router.post('/deactivateUser', deactivateUser);
router.put('/restoreUser/:id', restoreUser);
router.post('/updateUserStatus/:id', updateUserStatus);

// router.post("/createUser", upload.single("profileImage"), createUser);
// Add this route in your users route file
console.log("✅ userRoutes loaded"); // add this at the top
// router.get('/check-availability', checkEmailOrPhone);
router.get('/check-availability', (req, res, next) => {
    console.log("✅ /check-availability route hit");
    next(); // Pass to actual controller
  }, checkEmailOrPhone);
  router.get('/:id', getUserById); // Get user by ID


module.exports = router;
