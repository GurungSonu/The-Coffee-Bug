const express = require('express');
const { getAllUsers, getUserById, createUser, loginUser, logoutUser, updateUser, deleteUser, deactivateUser, restoreUser, updateUserStatus, loginAdmin } = require('../controllers/userController');
// const { getCartItems } = require('../controllers/cartController');
// const { default: Login } = require('../../Frontend/src/Components/LoginPage/Login');

const router = express.Router();

// User routes
router.get('/', getAllUsers); // Get all users
router.get('/:id', getUserById); // Get user by ID
router.post('/createUser', createUser); // Create new user
// router.delete('/deleteUser/:id', deleteUser); // Create new user
router.post('/updateUser', updateUser); // Create new user
router.post('/login', loginUser); // Login user
router.post('/adminLogin', loginAdmin);
router.post('/logout', logoutUser); // Logout user
// router.post('/deactivateUser', deactivateUser);
router.put('/restoreUser/:id', restoreUser);
router.post('/updateUserStatus/:id', updateUserStatus);

module.exports = router;
