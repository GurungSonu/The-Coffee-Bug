const pool = require('../db'); // ✅ your pool connection

const getAllTemperatures = (req, res) => {
  pool.query(`select * from TemperatureOption`,
    (err, result) => {
      if (err)return res.status(500).json({error: err.message});
      res.json(result);
    }
  );
}

// const addCustomProduct = (req, res) => {
//   const { UserID, ProductName, TemperatureID, Details } = req.body;

//   if (!UserID || !ProductName || !TemperatureID || !Array.isArray(Details) || !Details.length) {
//     return res.status(400).json({ message: "Invalid input data" });
//   }

//   const createdAt = new Date(); // or use MySQL NOW() function if preferred
//   let completed = 0;
//   let hasError = false;

//   const insertedIDs = [];

//   Details.forEach((item) => {
//     const query = `
//       INSERT INTO CustomProduct 
//       (UserID, ProductName, TemperatureID, CreatedAt, IngredientID, SizeID, Quantity) 
//       VALUES (?, ?, ?, ?, ?, ?, ?)`;

//     pool.query(
//       query,
//       [UserID, ProductName, TemperatureID, createdAt, item.IngredientID, item.SizeID, item.Quantity],
//       (err, result) => {
//         if (hasError) return;

//         if (err) {
//           hasError = true;
//           console.error("Error inserting custom product:", err);
//           return res.status(500).json({ message: "Failed to insert custom product" });
//         }

//         insertedIDs.push(result.insertId);
//         completed++;
//         if (completed === Details.length) {
//           res.status(201).json({
//             message: "Custom product entries inserted successfully",
//             InsertedIDs: insertedIDs
//           });
//         }
//       }
//     );
//   });
// };
const addFullCustomProduct = (req, res) => {
  const { UserID, ProductName, TemperatureID, TotalPrice, Details } = req.body;

  if (!UserID || !ProductName || !TemperatureID || typeof TotalPrice !== 'number' || !Array.isArray(Details) || !Details.length) {
    return res.status(400).json({ message: "Invalid input data" });
  }

  const createdAt = new Date();
  const insertProductQuery = `
    INSERT INTO CustomProduct (UserID, ProductName, TemperatureID, TotalPrice, CreatedAt)
    VALUES (?, ?, ?, ?, ?)
  `;

  pool.query(insertProductQuery, [UserID, ProductName, TemperatureID, TotalPrice, createdAt], (err, result) => {
    if (err) {
      console.error("Error inserting custom product:", err);
      return res.status(500).json({ message: "Failed to insert custom product" });
    }

    const customProductId = result.insertId;
    let completed = 0;
    let hasError = false;

    Details.forEach((item) => {
      const insertDetailQuery = `
        INSERT INTO CustomProductDetails (CustomProductID, IngredientID, SizeID, Quantity)
        VALUES (?, ?, ?, ?)
      `;

      pool.query(
        insertDetailQuery,
        [customProductId, item.IngredientID, item.SizeID, item.Quantity],
        (err) => {
          if (hasError) return;

          if (err) {
            hasError = true;
            console.error("Error inserting product detail:", err);
            return res.status(500).json({ message: "Failed to insert product details" });
          }

          completed++;
          if (completed === Details.length) {
            // Insert into custom cart
            const insertCartQuery = `
              INSERT INTO CustomCartItem (UserID, CustomProductID, Quantity, LineTotal, CartStatus)
              VALUES (?, ?, 1, ?, 'active')
            `;

            pool.query(insertCartQuery, [UserID, customProductId, TotalPrice], (err) => {
              if (err) {
                console.error("Error inserting into custom cart:", err);
                return res.status(500).json({ message: "Failed to add to custom cart" });
              }

              res.status(201).json({
                message: "Custom product, details, and cart entry inserted successfully",
                CustomProductID: customProductId
              });
            });
          }
        }
      );
    });
  });
};



module.exports = {
  getAllTemperatures,
  // addCustomProduct,
  addFullCustomProduct,
};
