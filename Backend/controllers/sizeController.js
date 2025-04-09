const pool = require('../db');

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
  const { role } = req.user; // Assuming the user role is stored in req.user (e.g., after JWT auth)

  if (role !== 'Admin') {
    return res.status(403).json({ message: 'Permission denied. Admin access required.' });
  }

  next(); // If the user is an admin, allow them to proceed
};

// Get all sizes
const getSizes = (req, res) => {
  pool.query(`
    SELECT s.*, i.IngredientName, c.CategoryName
    FROM Size s
    JOIN Ingredient i ON s.IngredientID = i.IngredientID
    JOIN IngredientCategory c ON i.CategoryID = c.CategoryID
  `, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

// Get sizes by category
const getSizesByCategory = (req, res) => {
  const { categoryId } = req.params;
  pool.query(`
    SELECT s.*, i.IngredientName
    FROM Size s
    JOIN Ingredient i ON s.IngredientID = i.IngredientID
    WHERE i.CategoryID = ?
  `, [categoryId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

// Get sizes by ingredient
// SizeController.js

// Get sizes by ingredient (to display available sizes per ingredient)
const getSizesByIngredient = (req, res) => {
    const { ingredientId } = req.params;
    pool.query(
        'SELECT * FROM Size WHERE IngredientID = ?',
        [ingredientId],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(result);
        }
    );
};


// Create size
const createSize = (req, res) => {
  const { ingredientId, unit, minQuantity, stepQuantity, pricePerStep } = req.body;

  // Check if the ingredientId exists in the Ingredient table
  pool.query('SELECT * FROM Ingredient WHERE IngredientID = ?', [ingredientId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    // If ingredientId does not exist, return an error
    if (result.length === 0) {
      return res.status(400).json({ error: 'IngredientID does not exist in Ingredient table' });
    }

    // Proceed with inserting the size if ingredient exists
    pool.query(
      `INSERT INTO Size (IngredientID, Unit, MinQuantity, StepQuantity, PricePerStep) 
       VALUES (?, ?, ?, ?, ?)`, 
      [ingredientId, unit, minQuantity, stepQuantity, pricePerStep], 
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        pool.query('SELECT * FROM Size WHERE SizeID = ?', [result.insertId], (err, results) => {
          if (err) return res.status(500).json({ error: err.message });
          res.status(201).json(results[0]);
        });
      }
    );
  });
};

// Update size
const updateSize = (req, res) => {
  const { id } = req.params;
  const { unit, minQuantity, stepQuantity, pricePerStep } = req.body;
  pool.query(
    `UPDATE Size 
     SET Unit = ?, MinQuantity = ?, StepQuantity = ?, PricePerStep = ?
     WHERE SizeID = ?`, 
    [unit, minQuantity, stepQuantity, pricePerStep, id], 
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Size not found' });
      }

      pool.query('SELECT * FROM Size WHERE SizeID = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results[0]);
      });
    }
  );
};

// Delete size
const deleteSize = (req, res) => {
  const { id } = req.params;
  pool.query('DELETE FROM Size WHERE SizeID = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Size not found' });
    }
    res.json({ message: 'Size deleted successfully' });
  });
};

module.exports = {
  getSizes,
  getSizesByCategory,
  getSizesByIngredient,
  createSize,
  updateSize,
  deleteSize,
  isAdmin
};
