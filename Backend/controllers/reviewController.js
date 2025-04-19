const pool = require("../db");

// 1️⃣ Create a review (only for standard products)
const createReview = (req, res) => {
    const { masterOrderID, productID, userID, rating, reviewText } = req.body;
  
    console.log("📥 Incoming review request body:", req.body); // 👀
  
    if (!masterOrderID || !productID || !userID || !rating) {
      console.log("❌ Missing required fields:", {
        masterOrderID,
        productID,
        userID,
        rating,
      });
      return res.status(400).json({ message: "Missing required fields" });
    }
  
    const checkQuery = `
  SELECT ProductID, Rating, ReviewText 
  FROM Review
  WHERE UserID = ? AND MasterOrderID = ?
`;

  
    pool.query(checkQuery, [masterOrderID, productID, userID], (err, result) => {
      if (err) {
        console.error("❌ Error checking existing review:", err);
        return res.status(500).json({ message: "Error checking review" });
      }
  
      if (result.length > 0) {
        console.log("⚠️ Review already exists for product", productID);
        return res.status(400).json({ message: "Review already submitted" });
      }
  
      const insertQuery = `
        INSERT INTO Review (MasterOrderID, ProductID, UserID, Rating, ReviewText)
        VALUES (?, ?, ?, ?, ?)
      `;
  
      pool.query(insertQuery, [masterOrderID, productID, userID, rating, reviewText], (err) => {
        if (err) {
          console.error("❌ Error inserting review:", err);
          return res.status(500).json({ message: "Error saving review" });
        }
  
        console.log("✅ Review inserted successfully for product", productID);
        res.status(200).json({ message: "✅ Review submitted successfully" });
      });
    });
  };
  

// 2️⃣ Get all reviews for a product
const getProductReviews = (req, res) => {
  const { productId } = req.params;

  const query = `SELECT * FROM Review WHERE ProductID = ? ORDER BY CreatedAt DESC`;

  pool.query(query, [productId], (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching reviews" });

    res.status(200).json(results);
  });
};

// 3️⃣ Check reviews for a user in an order
const getUserReviewsForOrder = (req, res) => {
  const { userId, masterOrderId } = req.params;

  const query = `
    SELECT ProductID FROM Review
    WHERE UserID = ? AND MasterOrderID = ?
  `;

  pool.query(query, [userId, masterOrderId], (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching user reviews" });
    

    const reviewedProductIDs = results.map(row => row.ProductID);
    console.log("📦 Reviews from DB:", results); // <-- Add this
    res.status(200).json(reviewedProductIDs);
  });
};

module.exports = {
  createReview,
  getProductReviews,
  getUserReviewsForOrder
};
