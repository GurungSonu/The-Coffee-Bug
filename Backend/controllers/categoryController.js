const pool = require('../db'); // Import the MySQL connection pool

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
    const { role } = req.user;
    if (role !== 'Admin') {
        return res.status(403).json({ message: 'Permission denied. Admin access required.' });
    }
    next();
};

// Get all categories
const getIngredientCategories = (req, res) => {
    pool.query('SELECT * FROM IngredientCategory', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// Get single category
const getCategoryById = (req, res) => {
    const { id } = req.params;
    pool.query('SELECT * FROM IngredientCategory WHERE CategoryID = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results.length ? results[0] : null);
    });
};

// Create category
const createCategory = (req, res) => {
    
    const { categoryName } = req.body;
    // console.log("Received request body:", req.body);

    if (!categoryName || categoryName.trim() === '') {
        return res.status(400).json({ error: 'Category name cannot be empty' });
    }
    console.log("Received request body:", req.body);

    pool.query('INSERT INTO IngredientCategory (CategoryName) VALUES (?)', [categoryName.trim()], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'Category name already exists' });
            }
            return res.status(500).json({ error: err.message });
        }
        pool.query('SELECT * FROM IngredientCategory WHERE CategoryID = ?', [result.insertId], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json(results[0]);
        });
    });
};

// Update category
const updateCategory = (req, res) => {
    const { id } = req.params;
    const { categoryName } = req.body;

    if (!categoryName || categoryName.trim() === '') {
        return res.status(400).json({ error: 'Category name cannot be empty' });
    }

    pool.query('UPDATE IngredientCategory SET CategoryName = ? WHERE CategoryID = ?', [categoryName.trim(), id], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'Category name already exists' });
            }
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }
        pool.query('SELECT * FROM IngredientCategory WHERE CategoryID = ?', [id], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results[0]);
        });
    });
};

// Delete category (Check for foreign key constraints)
const deleteCategory = (req, res) => {
    const { id } = req.params;

    pool.query('SELECT * FROM IngredientCategory WHERE CategoryID = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // Delete related ingredients first
        pool.query('DELETE FROM Ingredient WHERE CategoryID = ?', [id], (err) => {
            if (err) return res.status(500).json({ error: err.message });

            // Now delete the category
            pool.query('DELETE FROM IngredientCategory WHERE CategoryID = ?', [id], (err, result) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: 'Category deleted successfully' });
            });
        });
    });
};

module.exports = {
    isAdmin,
    getIngredientCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};
