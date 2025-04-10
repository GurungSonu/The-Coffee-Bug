const pool = require('../db'); // Assuming you're using a pool for DB connection

// Add product to custom cart
const addProductToCustomCart = (req, res) => {
  const { userID, customProductID, quantity } = req.body;

  // Validate input
  if (!userID || !customProductID || !quantity) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Calculate LineTotal: Calculate the custom product's price first
  const query = `
    SELECT SUM(s.PricePerStep * cpd.Quantity) AS customProductPrice
    FROM CustomProductDetails cpd
    JOIN Size s ON cpd.SizeID = s.SizeID
    WHERE cpd.CustomProductID = ?
  `;
  
  pool.query(query, [customProductID], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Error fetching product price' });
    }

    if (results.length === 0 || results[0].customProductPrice === null) {
      return res.status(404).json({ message: 'Custom product details not found' });
    }

    const customProductPrice = results[0].customProductPrice;
    const lineTotal = customProductPrice * quantity;

    // Insert or update the custom cart item in the CustomCartItem table
    pool.query(
      `INSERT INTO CustomCartItem (UserID, customProductID, Quantity, LineTotal)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
      Quantity = Quantity + ?, LineTotal = LineTotal + ?`,
      [userID, customProductID, quantity, lineTotal, quantity, lineTotal],
      (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Error adding product to custom cart' });
        }

        res.status(200).json({ message: 'Product added to custom cart successfully', data: results });
      }
    );
  });
};

// Controller function to fetch custom cart items for a user
const getCustomCartItems = (req, res) => {
  const { userID } = req.params; // Get userID from URL parameters

  // SQL query to fetch custom cart items for the specific user
  const query = `
    SELECT c.UserID, c.customProductID, c.Quantity, c.LineTotal, cp.CustomProductName
    FROM CustomCartItem c
    JOIN CustomProduct cp ON c.customProductID = cp.CustomProductID
    WHERE c.UserID = ? AND c.cartStatus = 'Active'
  `;

  // Query database to get custom cart items
  pool.query(query, [userID], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No custom cart items found for this user' });
    }

    res.json(results); // Return the results (custom cart items)
  });
};

// Update custom cart item (quantity and cart status)
const updateCustomCartItem = (req, res) => {
  const { userID, customProductID, quantity } = req.body;

  // Validate input
  if (!userID || !customProductID || !quantity) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Calculate LineTotal: Calculate the custom product's price first
  const query = `
    SELECT SUM(s.PricePerStep * cpd.Quantity) AS customProductPrice
    FROM CustomProductDetails cpd
    JOIN Size s ON cpd.SizeID = s.SizeID
    WHERE cpd.CustomProductID = ?
  `;
  
  pool.query(query, [customProductID], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Error fetching product price' });
    }

    if (results.length === 0 || results[0].customProductPrice === null) {
      return res.status(404).json({ message: 'Custom product details not found' });
    }

    const customProductPrice = results[0].customProductPrice;
    const lineTotal = customProductPrice * quantity;

    // Update the custom cart item in the CustomCartItem table
    pool.query(
      `UPDATE CustomCartItem
       SET Quantity = ?, LineTotal = ?
       WHERE UserID = ? AND customProductID = ? AND cartStatus = 'Active'`,
      [quantity, lineTotal, userID, customProductID],
      (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Error updating product in custom cart' });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({ message: 'Product not found in custom cart' });
        }

        res.status(200).json({ message: 'Product updated in custom cart successfully' });
      }
    );
  });
};

// Soft delete custom cart item (update cartStatus to 'Deleted')
const deleteCustomCartItem = (req, res) => {
  const { userID, customProductID } = req.params;

  // Validate input
  if (!userID || !customProductID) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Update the custom cart item's status to 'Deleted'
  pool.query(
    `UPDATE CustomCartItem
     SET cartStatus = 'Deleted'
     WHERE UserID = ? AND customProductID = ? AND cartStatus = 'Active'`,
    [userID, customProductID],
    (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Error deleting product from custom cart' });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Product not found in custom cart' });
      }

      res.status(200).json({ message: 'Product soft-deleted from custom cart successfully' });
    }
  );
};

module.exports = { 
  addProductToCustomCart,
  getCustomCartItems,
  updateCustomCartItem,
  deleteCustomCartItem
};
