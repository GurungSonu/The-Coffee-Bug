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
const getCartItems = (req, res) => {
    const { userID } = req.params; // Get userID from URL parameters
    console.log(req.params); 
  
    // SQL query to fetch cart items for the specific user
    const query = `
      SELECT m.UserID, m.ProductID, m.Quantity, m.LineTotal, p.ProductName, p.ProductPrice, p.Image
      FROM maincartitem m
      JOIN products p ON m.ProductID = p.ProductID
      WHERE m.UserID = ?
    `;
  
    // Query database to get cart items
    pool.query(query, [userID], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Database error' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ message: 'No cart items found for this user' });
      }
  
      res.json(results); // Return the results (cart items)
    });
  };
  

module.exports = { 
    addProductToCart,
    getCartItems
};
