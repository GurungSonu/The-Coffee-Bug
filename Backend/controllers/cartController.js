const pool = require('../db');

// =====================
// ✅ Add Product to Cart (Standard Product)
// =====================
const addProductToCart = (req, res) => {
  const { userID, productID, quantity, productPrice } = req.body;

  if (!userID || !productID || !quantity || !productPrice) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const lineTotal = productPrice * quantity;

  pool.query(
    `INSERT INTO MainCartItem (UserID, ProductID, Quantity, LineTotal)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
     Quantity = Quantity + ?, LineTotal = LineTotal + ?`,
    [userID, productID, quantity, lineTotal, quantity, lineTotal],
    (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Error adding product to cart' });
      }

      res.status(200).json({ message: 'Product added to cart successfully', data: results });
    }
  );
};

// =====================
// ✅ Get Combined Cart Items (Standard + Custom)
// =====================
const getCombinedCartItems = (req, res) => {
  const { userID } = req.params;

  const mainCartQuery = `
    SELECT 'main' AS Source, m.UserID, m.ProductID, m.Quantity, m.LineTotal, p.ProductName, p.ProductPrice, p.Image
    FROM maincartitem m
    JOIN products p ON m.ProductID = p.ProductID
    WHERE m.UserID = ? AND m.CartStatus = 'active'
  `;

  const customCartQuery = `
    SELECT 'custom' AS Source, c.UserID, c.CustomProductID, c.Quantity, c.LineTotal, cp.ProductName, cp.TotalPrice AS ProductPrice, NULL AS Image
    FROM customcartitem c
    JOIN customproduct cp ON c.CustomProductID = cp.CustomProductID
    WHERE c.UserID = ? AND c.CartStatus = 'active'
  `;

  pool.query(mainCartQuery, [userID], (err, mainResults) => {
    if (err) {
      console.error('Main cart query error:', err);
      return res.status(500).json({ message: 'Error fetching main cart items' });
    }

    pool.query(customCartQuery, [userID], (err, customResults) => {
      if (err) {
        console.error('Custom cart query error:', err);
        return res.status(500).json({ message: 'Error fetching custom cart items' });
      }

      const combined = [...mainResults, ...customResults];
      res.status(200).json(combined);
    });
  });
};

// =====================
// ✅ Update Combined Cart Item (Standard or Custom)
// =====================
const updateCombinedCartItem = (req, res) => {
  const { userID, itemID, quantity, itemType, productPrice, cartStatus } = req.body;

  if (!userID || !itemID || !quantity || !cartStatus || !itemType) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const lineTotal = productPrice * quantity;

  if (itemType === 'main') {
    const query = `
      UPDATE MainCartItem
      SET Quantity = ?, LineTotal = ?, CartStatus = ?
      WHERE UserID = ? AND ProductID = ?
    `;

    pool.query(query, [quantity, lineTotal, cartStatus, userID, itemID], (err, results) => {
      if (err) {
        console.error('Error updating main cart:', err);
        return res.status(500).json({ message: 'Failed to update main cart item' });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Main cart item not found' });
      }

      res.status(200).json({ message: 'Main cart item updated successfully' });
    });
  } else if (itemType === 'custom') {
    const query = `
      UPDATE CustomCartItem
      SET Quantity = ?, LineTotal = ?, CartStatus = ?
      WHERE UserID = ? AND CustomProductID = ?
    `;

    pool.query(query, [quantity, lineTotal, cartStatus, userID, itemID], (err, results) => {
      if (err) {
        console.error('Error updating custom cart:', err);
        return res.status(500).json({ message: 'Failed to update custom cart item' });
      }

      if (results.affectedRows === 0) {
        console.warn("Custom cart item not found:", { userID, itemID });
        return res.status(404).json({ message: 'Custom cart item not found' });
      }

      res.status(200).json({ message: 'Custom cart item updated successfully' });
    });
  } else {
    return res.status(400).json({ message: 'Invalid item type' });
  }
};

// =====================
// ✅ Delete Combined Cart Item (Soft Delete)
// =====================
const deleteCombinedCartItem = (req, res) => {
  const { userID, itemID, itemType } = req.params; // ✅ All from params

  if (!userID || !itemID || !itemType) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  let query = "";
  if (itemType === 'main') {
    query = `UPDATE MainCartItem SET CartStatus = 'Deleted' WHERE UserID = ? AND ProductID = ?`;
  } else if (itemType === 'custom') {
    query = `UPDATE CustomCartItem SET CartStatus = 'Deleted' WHERE UserID = ? AND CustomProductID = ?`;
  } else {
    return res.status(400).json({ message: 'Invalid item type' });
  }

  pool.query(query, [userID, itemID], (err, results) => {
    if (err) {
      console.error('Error deleting cart item:', err);
      return res.status(500).json({ message: 'Failed to delete cart item' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: `Cart item not found in ${itemType} cart` });
    }

    res.status(200).json({ message: `${itemType} cart item deleted successfully` });
  });
};



// =====================
// ✅ Export
// =====================
module.exports = {
  addProductToCart,
  getCombinedCartItems,
  updateCombinedCartItem,
  deleteCombinedCartItem
};
