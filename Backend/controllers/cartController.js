const pool = require('../db'); // Assuming you're using a pool for DB connection

// Add product to cart
const addProductToCart = (req, res) => {
  const { userID, productID, quantity, productPrice } = req.body;

  // Validate input
  if (!userID || !productID || !quantity || !productPrice) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Calculate LineTotal: Price * Quantity
  const lineTotal = productPrice * quantity;

  // Insert or update the cart item in the MainCartItem table
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

// Controller function to fetch cart items for a user
// const getCartItems = (req, res) => {
//     const { userID } = req.params; // Get userID from URL parameters
//     console.log(req.params); 
  
//     // SQL query to fetch cart items for the specific user
//     const query = `
//       SELECT m.UserID, m.ProductID, m.Quantity, m.LineTotal, p.ProductName, p.ProductPrice, p.Image
//       FROM maincartitem m
//       JOIN products p ON m.ProductID = p.ProductID
//       WHERE m.UserID = ?
//     `;
  
//     // Query database to get cart items
//     pool.query(query, [userID], (err, results) => {
//       if (err) {
//         console.error('Database error:', err);
//         return res.status(500).json({ message: 'Database error' });
//       }
  
//       if (results.length === 0) {
//         return res.status(404).json({ message: 'No cart items found for this user' });
//       }
  
//       res.json(results); // Return the results (cart items)
//     });
//   };


const getCombinedCartItems = (req, res) => {
  const { userID } = req.params;

  const mainCartQuery = `
    SELECT 'main' AS Source, m.UserID, m.ProductID, m.Quantity, m.LineTotal, p.ProductName, p.ProductPrice, p.Image
    FROM maincartitem m
    JOIN products p ON m.ProductID = p.ProductID
    WHERE m.UserID = ? AND m.CartStatus = 'active'
  `;

  const customCartQuery = `
    SELECT 'custom' AS Source, c.UserID, c.CustomProductID, c.Quantity, c.LineTotal, cp.ProductName, NULL AS ProductPrice, NULL AS Image
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
  // Update product quantity and status in the cart
const updateCartItem = (req, res) => {
  const { userID, productID, quantity, productPrice, cartStatus } = req.body;

  // Validate input
  if (!userID || !productID || !quantity || !productPrice || !cartStatus) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Calculate LineTotal: Price * Quantity
  const lineTotal = productPrice * quantity;

  // Update the cart item in the MainCartItem table
  pool.query(
    `UPDATE MainCartItem
     SET Quantity = ?, LineTotal = ?, cartStatus = ?
     WHERE UserID = ? AND ProductID = ?`,
    [quantity, lineTotal, cartStatus, userID, productID],
    (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Error updating product in cart' });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Product not found in cart' });
      }

      res.status(200).json({ message: 'Product updated in cart successfully' });
    }
  );
};

  
  // Delete product from cart
  const deleteCartItem = (req, res) => {
    const { userID, productID } = req.params;
  
    // Validate input
    if (!userID || !productID) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
  
    // Delete the product from the MainCartItem table
    pool.query(
      `UPDATE MainCartItem
       SET cartStatus = 'Deleted'
       WHERE UserID = ? AND ProductID = ?`,
      [userID, productID],
      (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Error deleting product from cart' });
        }
  
        if (results.affectedRows === 0) {
          return res.status(404).json({ message: 'Product not found in cart' });
        }
  
        res.status(200).json({ message: 'Product soft-deleted from cart successfully' });
      }
    );
  };
  
  
  

module.exports = { 
    addProductToCart,
    // getCartItems,
    updateCartItem,
    deleteCartItem,
    getCombinedCartItems,
};
