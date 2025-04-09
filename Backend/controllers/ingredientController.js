const pool = require('../db');  // Import the MySQL connection pool

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
  const { role } = req.user; // Assuming the user role is stored in req.user (e.g., after JWT auth)

  if (role !== 'Admin') {
    return res.status(403).json({ message: 'Permission denied. Admin access required.' });
  }

  next(); // If the user is an admin, allow them to proceed
};

// Get all ingredients
const getIngredients = (req, res) => {
    pool.query(`
        SELECT i.*, c.CategoryName 
        FROM Ingredient i
        JOIN IngredientCategory c ON i.CategoryID = c.CategoryID
      `, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
      });
      
};
// IngredientController.js

// Get all ingredients (optionally filter by category)
const getCustomerIngredients = (req, res) => {
  const { categoryId } = req.query;  // Optionally filter by category
  let query = `
      SELECT i.*, c.CategoryName
      FROM Ingredient i
      JOIN IngredientCategory c ON i.CategoryID = c.CategoryID
  `;
  let params = [];
  
  if (categoryId) {
      query += ' WHERE i.CategoryID = ?';
      params.push(categoryId);
  }

  pool.query(query, params, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(result);
  });
};


// Get ingredient by ID
const getIngredientById = (req, res) => {
  const { id } = req.params;
  pool.query(`
    SELECT i.*, c.CategoryName 
    FROM Ingredient i
    JOIN IngredientCategory c ON i.CategoryID = c.CategoryID
    WHERE i.IngredientID = ?
  `, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result[0] || null);
  });
  
};

// Create ingredient
const createIngredient = (req, res) => {
  const { categoryId, ingredientName, available = true } = req.body;
  pool.query(
    `INSERT INTO Ingredient (CategoryID, IngredientName, Available) 
     VALUES (?, ?, ?)`, 
    [categoryId, ingredientName, available], 
    (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ error: 'Ingredient name already exists' });
        }
        return res.status(500).json({ error: err.message });
      }
      pool.query('SELECT * FROM Ingredient WHERE IngredientID = ?', [result.insertId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json(results[0]);
      });
    }
  );
  
};

// Update ingredient
const updateIngredient = (req, res) => {
  const { id } = req.params;
  const { categoryId, ingredientName, available } = req.body;
  pool.query(
    `UPDATE Ingredient 
     SET CategoryID = ?, IngredientName = ?, Available = ?
     WHERE IngredientID = ?`, 
    [categoryId, ingredientName, available, id], 
    (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ error: 'Ingredient name already exists' });
        }
        return res.status(500).json({ error: err.message });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Ingredient not found' });
      }
      pool.query('SELECT * FROM Ingredient WHERE IngredientID = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results[0]);
      });
    }
  );
};

// Delete ingredient
const deleteIngredient = (req, res) => {
  const { id } = req.params;
  pool.query('DELETE FROM Ingredient WHERE IngredientID = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Ingredient not found' });
    }
    res.json({ message: 'Ingredient deleted successfully' });
  });
};

// Toggle availability
const toggleAvailability = (req, res) => {
  const { id } = req.params;
  pool.query(
    'UPDATE Ingredient SET Available = NOT Available WHERE IngredientID = ?',
    [id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      pool.query('SELECT * FROM Ingredient WHERE IngredientID = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results[0]);
      });
    }
  );
  
};

module.exports = {
  getIngredients,
  getIngredientById,
  createIngredient,
  updateIngredient,
  deleteIngredient,
  toggleAvailability,
  getCustomerIngredients,
  isAdmin
};
