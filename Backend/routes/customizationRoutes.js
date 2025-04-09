const express = require('express');


const {  getCategoryById, updateCategory, deleteCategory, createCategory, getIngredientCategories } = require('../controllers/categoryController');
const {  getSizesByIngredient, getSizes, getSizesByCategory, createSize, updateSize, deleteSize } = require('../controllers/sizeController');
const {  toggleAvailability, deleteIngredient, updateIngredient, createIngredient, getIngredientById, getIngredients, getCustomerIngredients } = require('../controllers/IngredientController');
// const { getSizes, getSizesByCategory, createSize, updateSize, deleteSize } = require('../controllers/SizeController');

const { authenticateToken, isAdmin } = require('../controllers/userController');
const router = express.Router();

// categories
router.post('/createCategories', createCategory);
router.get('/categories', getIngredientCategories );
router.get('/categories/:id', getCategoryById);
router.put('/categories/:id',authenticateToken, isAdmin, updateCategory);
router.delete('/categories/:id',authenticateToken, isAdmin, deleteCategory);

// ingredients
router.get('/ingredients', getIngredients);
router.get('/ingredients/:id', getIngredientById);
router.post('/ingredients',authenticateToken, isAdmin, createIngredient);
router.put('/ingredients/:id',authenticateToken, isAdmin, updateIngredient);
router.delete('/ingredients/:id',authenticateToken, isAdmin, deleteIngredient);
router.patch('/ingredients/:id/availability',authenticateToken, isAdmin, toggleAvailability);
router.get('/customerIngredients', getCustomerIngredients)

// for size
router.get('/sizes', getSizes);
router.get('/sizes/category/:categoryId', getSizesByCategory);
router.get('/sizes/ingredient/:ingredientId', getSizesByIngredient);
router.post('/sizes',authenticateToken, isAdmin, createSize);
router.put('/sizes/:id',authenticateToken, isAdmin, updateSize);
router.delete('/sizes/:id', authenticateToken, isAdmin, deleteSize);

module.exports = router;