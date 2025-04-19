const axios = require("axios");
const pool = require("../db"); // ✅ <-- Add this line


const initiateKhaltiPayment = async (req, res) => {
  const { orderId, amount, user } = req.body;

  console.log("🛠️ Initiating Khalti Payment with:", {
    orderId,
    amount,
    user
  });

  try {
    const khaltiRes = await axios.post(
      "https://dev.khalti.com/api/v2/epayment/initiate/",
      {
        return_url: "http://localhost:5173/khalti-success", 
        website_url: "http://localhost:5173",
        amount: Math.round(amount * 100),
        purchase_order_id: `ORD-${orderId}`,
        purchase_order_name: "CoffeeBug Order",
        customer_info: {
          name: user?.name || "Test User",
          email: user?.email || "test@example.com",
          phone: user?.phone || "9800000001"
        }
      },
      {
        headers: {
          Authorization: "Key c90ee672cb4d43b79da7f220c2c2ca1a", // sandbox secret key
          "Content-Type": "application/json"
        }
      }
    );

    console.log("✅ Khalti INIT response:", khaltiRes.data);
    return res.status(200).json(khaltiRes.data); // ✅ Only send one response

  } catch (err) {
    console.error("❌ Khalti INIT Error:", err.response?.data || err.message);
    return res.status(500).json({ message: "Failed to initiate Khalti payment" });
  }
};

// const lookupKhaltiPayment = async (req, res) => {
//   const { pidx } = req.body;

//   if (!pidx) return res.status(400).json({ message: "Missing pidx" });

//   try {
//     const lookupRes = await axios.post(
//       "https://dev.khalti.com/api/v2/epayment/lookup/",
//       { pidx },
//       {
//         headers: {
//           Authorization: "Key c90ee672cb4d43b79da7f220c2c2ca1a", // sandbox secret
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     console.log("🔍 Lookup Response:", lookupRes.data);

//     const { status, purchase_order_id } = lookupRes.data;

//     const masterOrderID = parseInt(purchase_order_id?.replace("ORD-", ""), 10);

//     if (status === "Completed") {
//       const updateQuery = "UPDATE MasterOrder SET Status = 'Paid' WHERE MasterOrderID = ?";
//       pool.query(updateQuery, [masterOrderID], (err) => {
//         if (err) {
//           console.error("❌ Error updating payment status:", err);
//           return res.status(500).json({ message: "Database error" });
//         }
//         return res.status(200).json({ message: "Payment verified and status updated!" });
//       });
//     } else {
//       return res.status(200).json({ message: `Payment status: ${status}` });
//     }
//   } catch (err) {
//     console.error("❌ Lookup error:", err.response?.data || err.message);
//     return res.status(500).json({ message: "Payment verification failed" });
//   }
// };

const lookupKhaltiPayment = async (req, res) => {
  const { pidx } = req.body;

  if (!pidx) return res.status(400).json({ message: "Missing pidx" });

  try {
    const lookupRes = await axios.post(
      "https://dev.khalti.com/api/v2/epayment/lookup/",
      { pidx },
      {
        headers: {
          Authorization: "Key c90ee672cb4d43b79da7f220c2c2ca1a", // sandbox secret
          "Content-Type": "application/json",
        },
      }
    );

    console.log("🔍 Lookup Response:", lookupRes.data);
    return res.status(200).json(lookupRes.data); // ✅ JUST return the data — no DB update here
  } catch (err) {
    console.error("❌ Lookup error:", err.response?.data || err.message);
    return res.status(500).json({ message: "Payment verification failed" });
  }
};


const estimateOrderTotal = (req, res) => {
  const { userID } = req.params;

  if (!userID) return res.status(400).json({ message: "User ID required" });

  const fetchMainCart = `SELECT LineTotal FROM MainCartItem WHERE UserID = ? AND CartStatus = 'active'`;
  const fetchCustomCart = `SELECT LineTotal FROM CustomCartItem WHERE UserID = ? AND CartStatus = 'active'`;

  pool.query(fetchMainCart, [userID], (err, mainResults) => {
    if (err) return res.status(500).json({ message: "Error fetching main cart" });

    pool.query(fetchCustomCart, [userID], (err, customResults) => {
      if (err) return res.status(500).json({ message: "Error fetching custom cart" });

      const mainTotal = mainResults.reduce((sum, item) => sum + parseFloat(item.LineTotal), 0);
      const customTotal = customResults.reduce((sum, item) => sum + parseFloat(item.LineTotal), 0);
      const subTotal = mainTotal + customTotal;
      const shipping = subTotal > 0 ? 100 : 0;
      const grandTotal = subTotal + shipping;

      res.status(200).json({ grandTotal });
    });
  });
};

// const verifyKhaltiPayment = async (req, res) => {
//   const { pidx, masterOrderID, userID, amount } = req.body;

//   if (!pidx || !masterOrderID || !userID || !amount) {
//     return res.status(400).json({ message: "Missing fields for verification" });
//   }

//   try {
//     // 🔍 Perform lookup
//     const lookupRes = await axios.post(
//       "https://dev.khalti.com/api/v2/epayment/lookup/",
//       { pidx },
//       {
//         headers: {
//           Authorization: "Key c90ee672cb4d43b79da7f220c2c2ca1a", // sandbox secret
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     const { status, transaction_id } = lookupRes.data;

//     if (status === "Completed") {
//       // ✅ Update MasterOrder table
//       const updateMasterOrderQuery = `
//         UPDATE MasterOrder
//         SET Status = 'Completed', PaymentMethod = 'Khalti'
//         WHERE MasterOrderID = ?
//       `;

//       pool.query(updateMasterOrderQuery, [masterOrderID], (err) => {
//         if (err) {
//           console.error("❌ Failed to update MasterOrder:", err);
//           return res.status(500).json({ message: "Failed to update MasterOrder" });
//         }

//         // 💾 Insert into Payment table
//         const insertPaymentQuery = `
//           INSERT INTO Payment
//           (MasterOrderID, UserID, PaymentAmount, PaymentStatus, PaymentMethod, PaymentDescription)
//           VALUES (?, ?, ?, 'Completed', 'Khalti', ?)
//         `;

//         pool.query(
//           insertPaymentQuery,
//           [masterOrderID, userID, amount, transaction_id],
//           (err) => {
//             if (err) {
//               console.error("❌ Failed to insert into Payment table:", err);
//               return res.status(500).json({ message: "Payment verified, but saving failed" });
//             }

//             return res.status(200).json({ message: "✅ Payment verified and saved" });
//           }
//         );
//       });
//     } else {
//       return res.status(400).json({ message: `Payment status: ${status}` });
//     }
//   } catch (err) {
//     console.error("❌ Lookup failed:", err.response?.data || err.message);
//     return res.status(500).json({ message: "Payment lookup failed" });
//   }
// };

// const verifyKhaltiPayment = async (req, res) => {
//   const { pidx, masterOrderID, userID, amount } = req.body;

//   if (!pidx || !masterOrderID || !userID || !amount) {
//     return res.status(400).json({ message: "Missing fields for verification" });
//   }

//   try {
//     // 🔍 Perform Khalti lookup
//     const lookupRes = await axios.post(
//       "https://dev.khalti.com/api/v2/epayment/lookup/",
//       { pidx },
//       {
//         headers: {
//           Authorization: "Key c90ee672cb4d43b79da7f220c2c2ca1a", // sandbox secret
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     const { status, transaction_id } = lookupRes.data;

//     if (status === "Completed") {
//       // ✅ Update PaymentStatus only
//       const updateQuery = `
//         UPDATE MasterOrder
//         SET PaymentStatus = 'Completed', PaymentMethod = 'Khalti'
//         WHERE MasterOrderID = ?
//       `;

//       pool.query(updateQuery, [masterOrderID], (err) => {
//         if (err) {
//           console.error("❌ Failed to update payment status:", err);
//           return res.status(500).json({ message: "Failed to update payment status" });
//         }

//         // 💾 Insert payment record
//         const insertPaymentQuery = `
//           INSERT INTO Payment
//           (MasterOrderID, UserID, PaymentAmount, PaymentStatus, PaymentMethod, PaymentDescription)
//           VALUES (?, ?, ?, 'Completed', 'Khalti', ?)
//         `;

//         pool.query(
//           insertPaymentQuery,
//           [masterOrderID, userID, amount, transaction_id],
//           (err) => {
//             if (err) {
//               console.error("❌ Failed to insert into Payment table:", err);
//               return res.status(500).json({ message: "Payment verified, but saving failed" });
//             }

//             return res.status(200).json({ message: "✅ Payment verified and saved" });
//           }
//         );
//       });
//     } else {
//       return res.status(400).json({ message: `Payment status: ${status}` });
//     }
//   } catch (err) {
//     console.error("❌ Lookup failed:", err.response?.data || err.message);
//     return res.status(500).json({ message: "Payment lookup failed" });
//   }
// };

// const verifyKhaltiPayment = async (req, res) => {
//   const { pidx, masterOrderID, userID, amount } = req.body;

//   if (!pidx || !masterOrderID || !userID || !amount) {
//     return res.status(400).json({ message: "Missing fields for verification" });
//   }

//   try {
//     const lookupRes = await axios.post(
//       "https://dev.khalti.com/api/v2/epayment/lookup/",
//       { pidx },
//       {
//         headers: {
//            Authorization: "Key c90ee672cb4d43b79da7f220c2c2ca1a", // ✅ this is your sandbox secret key
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     const { status, transaction_id } = lookupRes.data;

//     if (status === "Completed") {
//       // ✅ Check if payment already saved
//       // const checkQuery = `SELECT * FROM Payment WHERE MasterOrderID = ?`;
//       // pool.query(checkQuery, [masterOrderID], (err, results) => {
//       //   if (err) return res.status(500).json({ message: "Check failed" });

//       //   if (results.length > 0) {
//       //     return res.status(200).json({ message: "Payment already verified" });
//       //   }
//       const checkQuery = `SELECT * FROM Payment WHERE PaymentDescription = ?`;
//       pool.query(checkQuery, [pidx], (err, results) => {
//         if (err) return res.status(500).json({ message: "Check failed" });

//         if (results.length > 0) {
//           console.log("⚠️ Payment already recorded for this pidx.");
//           return res.status(200).json({ message: "Payment already verified" });
//         }


//         // 💾 Insert new payment
//         const insertPayment = `
//           INSERT INTO Payment (MasterOrderID, UserID, PaymentAmount, PaymentStatus, PaymentMethod, PaymentDescription)
//           VALUES (?, ?, ?, 'Completed', 'Khalti', ?)
//         `;

//         pool.query(
//           insertPayment,
//           [masterOrderID, userID, amount, transaction_id],
//           (err) => {
//             if (err) return res.status(500).json({ message: "Insert failed" });
//             return res.status(200).json({ message: "✅ Payment saved" });
//           }
//         );
//       });
//     } else {
//       return res.status(400).json({ message: `Payment status: ${status}` });
//     }
//   } catch (err) {
//     return res.status(500).json({ message: "Payment lookup failed" });
//   }
// };
// please chala naaa
// const verifyKhaltiPayment = async (req, res) => {
//   const { pidx, masterOrderID, userID, amount } = req.body;

//   if (!pidx || !masterOrderID || !userID || !amount) {
//     return res.status(400).json({ message: "Missing fields for verification" });
//   }

//   try {
//     console.log("🔍 Verifying Khalti payment with PIDX:", pidx);

//     const lookupRes = await axios.post(
//       "https://dev.khalti.com/api/v2/epayment/lookup/",
//       { pidx },
//       {
//         headers: {
//           Authorization: "Key c90ee672cb4d43b79da7f220c2c2ca1a", // your sandbox key
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     const { status } = lookupRes.data;

//     if (status === "Completed") {
//       const checkQuery = `SELECT * FROM Payment WHERE PaymentDescription = ?`;
//       pool.query(checkQuery, [pidx], (err, results) => {
//         if (err) {
//           console.error("❌ DB check failed:", err);
//           return res.status(500).json({ message: "Check failed" });
//         }

//         if (results.length > 0) {
//           console.log("⚠️ Payment already saved for this PIDX");
//           return res.status(200).json({ message: "Payment already verified" });
//         }

//         const insertPayment = `
//           INSERT INTO Payment (MasterOrderID, UserID, PaymentAmount, PaymentStatus, PaymentMethod, PaymentDescription)
//           VALUES (?, ?, ?, 'Completed', 'Khalti', ?)
//         `;

//         pool.query(insertPayment, [masterOrderID, userID, amount, pidx], (err) => {
//           if (err) {
//             console.error("❌ Failed to insert payment:", err);
//             return res.status(500).json({ message: "Insert failed" });
//           }

//           console.log("✅ Payment saved for masterOrderID:", masterOrderID);
//           return res.status(200).json({ message: "✅ Payment saved" });
//         });
//       });
//     } else {
//       return res.status(400).json({ message: `Payment status: ${status}` });
//     }
//   } catch (err) {
//     console.error("❌ Lookup error:", err.response?.data || err.message);
//     return res.status(500).json({ message: "Payment lookup failed" });
//   }
// };

// pleaseeeee
// const verifyKhaltiPayment = async (req, res) => {
//   const { pidx, amount, pendingCheckout } = req.body;

//   if (!pidx || !amount || !pendingCheckout || !pendingCheckout.userID) {
//     return res.status(400).json({ message: "Missing fields for verification" });
//   }

//   try {
//     console.log("🔍 Verifying Khalti payment with PIDX:", pidx);

//     // Step 1: Lookup
//     const lookupRes = await axios.post(
//       "https://dev.khalti.com/api/v2/epayment/lookup/",
//       { pidx },
//       {
//         headers: {
//           Authorization: "Key c90ee672cb4d43b79da7f220c2c2ca1a",
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     const { status } = lookupRes.data;
//     if (status !== "Completed") {
//       return res.status(400).json({ message: `Payment status: ${status}` });
//     }

//     // Step 2: Check if payment already saved
//     const checkQuery = `SELECT * FROM Payment WHERE PaymentDescription = ?`;
//     pool.query(checkQuery, [pidx], (err, result) => {
//       if (err) return res.status(500).json({ message: "Payment check failed" });

//       if (result.length > 0) {
//         console.log("⚠️ Payment already recorded");
//         return res.status(200).json({ message: "Already processed", masterOrderID: result[0].MasterOrderID });
//       }

//       // Step 3: Create Order (inside verify-payment)
//       const { userID, deliveryMethod, paymentMethod, deliveryAddress } = pendingCheckout;

//       const fetchMainCart = `SELECT ProductID, Quantity, LineTotal FROM MainCartItem WHERE UserID = ? AND CartStatus = 'active'`;
//       const fetchCustomCart = `SELECT CustomProductID, Quantity, LineTotal FROM CustomCartItem WHERE UserID = ? AND CartStatus = 'active'`;

//       pool.query(fetchMainCart, [userID], (err, mainResults) => {
//         if (err) return res.status(500).json({ message: "Error fetching main cart" });

//         pool.query(fetchCustomCart, [userID], (err, customResults) => {
//           if (err) return res.status(500).json({ message: "Error fetching custom cart" });

//           const mainTotal = mainResults.reduce((sum, item) => sum + parseFloat(item.LineTotal), 0);
//           const customTotal = customResults.reduce((sum, item) => sum + parseFloat(item.LineTotal), 0);
//           const subTotal = mainTotal + customTotal;
//           const shipping = deliveryMethod === "Delivery" ? 100 : 0;
//           const grandTotal = subTotal + shipping;

//           let mainOrderID = null;
//           let customOrderID = null;

//           const insertMasterOrder = () => {
//             const insertMaster = `
//               INSERT INTO MasterOrder (
//                 MainOrderID, CustomOrderID, Status, OrderDate,
//                 DeliveryMethod, PaymentMethod, DeliveryAddress,
//                 ExpectedDeliveryDate, SubTotal, ShippingCharge, GrandTotal
//               ) VALUES (?, ?, 'Pending', NOW(), ?, ?, ?, DATE_ADD(NOW(), INTERVAL 30 MINUTE), ?, ?, ?)
//             `;

//             pool.query(insertMaster, [
//               mainOrderID,
//               customOrderID,
//               deliveryMethod,
//               paymentMethod,
//               deliveryAddress,
//               subTotal,
//               shipping,
//               grandTotal
//             ], (err, masterRes) => {
//               if (err) return res.status(500).json({ message: "Master order failed" });

//               const masterOrderID = masterRes.insertId;

//               // ✅ Insert payment AFTER order creation
//               const insertPayment = `
//                 INSERT INTO Payment (MasterOrderID, UserID, PaymentAmount, PaymentStatus, PaymentMethod, PaymentDescription)
//                 VALUES (?, ?, ?, 'Completed', 'Khalti', ?)
//               `;

//               pool.query(insertPayment, [masterOrderID, userID, amount, pidx], (err) => {
//                 if (err) return res.status(500).json({ message: "Payment insert failed" });

//                 // Clear cart
//                 pool.query(`DELETE FROM MainCartItem WHERE UserID = ?`, [userID]);
//                 pool.query(`DELETE FROM CustomCartItem WHERE UserID = ?`, [userID]);

//                 return res.status(200).json({ message: "✅ Order & payment saved", masterOrderID });
//               });
//             });
//           };

//           const insertCustomIfAny = () => {
//             if (customResults.length === 0) return insertMasterOrder();

//             const insertCustom = `INSERT INTO CustomOrders (UserID, OrderDate, TotalPrice, Status) VALUES (?, NOW(), ?, 'Pending')`;
//             pool.query(insertCustom, [userID, customTotal], (err, customRes) => {
//               if (err) return res.status(500).json({ message: "Custom order failed" });

//               customOrderID = customRes.insertId;
//               const customItems = customResults.map(item => [
//                 customOrderID, item.CustomProductID, item.Quantity, item.LineTotal
//               ]);

//               pool.query(`INSERT INTO CustomOrderItems (CustomOrderID, CustomProductID, Quantity, Subtotal) VALUES ?`,
//                 [customItems], (err) => {
//                   if (err) return res.status(500).json({ message: "Insert custom items failed" });
//                   insertMasterOrder();
//                 });
//             });
//           };

//           if (mainResults.length === 0) return insertCustomIfAny();

//           const insertMain = `INSERT INTO MainOrders (OrderDate, OrderStatus, OrderTotalAmount, UserID) VALUES (NOW(), 'Pending', ?, ?)`;
//           pool.query(insertMain, [mainTotal, userID], (err, mainRes) => {
//             if (err) return res.status(500).json({ message: "Main order failed" });

//             mainOrderID = mainRes.insertId;
//             const mainItems = mainResults.map(item => [
//               item.Quantity, item.LineTotal, mainOrderID, item.ProductID
//             ]);

//             pool.query(`INSERT INTO MainOrderItem (OrderedItemQuantity, LineTotal, MainOrderID, ProductID) VALUES ?`,
//               [mainItems], (err) => {
//                 if (err) return res.status(500).json({ message: "Insert main items failed" });
//                 insertCustomIfAny();
//               });
//           });
//         });
//       });
//     });
//   } catch (err) {
//     console.error("❌ Lookup error:", err.response?.data || err.message);
//     return res.status(500).json({ message: "Khalti lookup failed" });
//   }
// };

// yo chai last aba
// const verifyKhaltiPayment = async (req, res) => {
//   const { pidx, amount, pendingCheckout } = req.body;

//   if (!pidx || !amount || !pendingCheckout || !pendingCheckout.userID) {
//     return res.status(400).json({ message: "Missing fields for verification" });
//   }

//   try {
//     console.log("🔍 Verifying Khalti payment with PIDX:", pidx);

//     // 🔍 Step 1: Lookup
//     const lookupRes = await axios.post(
//       "https://dev.khalti.com/api/v2/epayment/lookup/",
//       { pidx },
//       {
//         headers: {
//           Authorization: "Key c90ee672cb4d43b79da7f220c2c2ca1a",
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     const { status } = lookupRes.data;
//     if (status !== "Completed") {
//       return res.status(400).json({ message: `Payment status: ${status}` });
//     }

//     // 🔐 Step 2: Try to insert payment (which includes order creation)
//     const { userID, deliveryMethod, paymentMethod, deliveryAddress } = pendingCheckout;

//     // Check cart and calculate totals
//     const fetchMainCart = `SELECT ProductID, Quantity, LineTotal FROM MainCartItem WHERE UserID = ? AND CartStatus = 'active'`;
//     const fetchCustomCart = `SELECT CustomProductID, Quantity, LineTotal FROM CustomCartItem WHERE UserID = ? AND CartStatus = 'active'`;

//     pool.query(fetchMainCart, [userID], (err, mainResults) => {
//       if (err) return res.status(500).json({ message: "Error fetching main cart" });

//       pool.query(fetchCustomCart, [userID], (err, customResults) => {
//         if (err) return res.status(500).json({ message: "Error fetching custom cart" });

//         const mainTotal = mainResults.reduce((sum, item) => sum + parseFloat(item.LineTotal), 0);
//         const customTotal = customResults.reduce((sum, item) => sum + parseFloat(item.LineTotal), 0);
//         const subTotal = mainTotal + customTotal;
//         const shipping = deliveryMethod === "Delivery" ? 100 : 0;
//         const grandTotal = subTotal + shipping;

//         let mainOrderID = null;
//         let customOrderID = null;

//         const insertMasterOrder = () => {
//           const insertMaster = `
//             INSERT INTO MasterOrder (
//               MainOrderID, CustomOrderID, Status, OrderDate,
//               DeliveryMethod, PaymentMethod, DeliveryAddress,
//               ExpectedDeliveryDate, SubTotal, ShippingCharge, GrandTotal
//             )
//             VALUES (?, ?, 'Pending', NOW(), ?, ?, ?, DATE_ADD(NOW(), INTERVAL 30 MINUTE), ?, ?, ?)
//           `;

//           pool.query(insertMaster, [
//             mainOrderID, customOrderID,
//             deliveryMethod, paymentMethod, deliveryAddress,
//             subTotal, shipping, grandTotal
//           ], (err, masterRes) => {
//             if (err) return res.status(500).json({ message: "Master order failed" });

//             const masterOrderID = masterRes.insertId;

//             // Try inserting payment — if duplicate pidx, it will now throw error due to UNIQUE constraint
//             const insertPayment = `
//               INSERT INTO Payment (MasterOrderID, UserID, PaymentAmount, PaymentStatus, PaymentMethod, PaymentDescription)
//               VALUES (?, ?, ?, 'Completed', 'Khalti', ?)
//             `;

//             pool.query(insertPayment, [masterOrderID, userID, amount, pidx], (err) => {
//               if (err) {
//                 if (err.code === 'ER_DUP_ENTRY') {
//                   console.log("⚠️ Duplicate payment blocked by DB. Order already exists.");
//                   return res.status(200).json({ message: "Order already processed." });
//                 }
//                 return res.status(500).json({ message: "Payment insert failed" });
//               }

//               // 🧹 Clean cart
//               pool.query(`DELETE FROM MainCartItem WHERE UserID = ?`, [userID]);
//               pool.query(`DELETE FROM CustomCartItem WHERE UserID = ?`, [userID]);

//               return res.status(200).json({ message: "✅ Order & payment saved", masterOrderID });
//             });
//           });
//         };

//         const insertCustomIfAny = () => {
//           if (customResults.length === 0) return insertMasterOrder();

//           const insertCustom = `INSERT INTO CustomOrders (UserID, OrderDate, TotalPrice, Status) VALUES (?, NOW(), ?, 'Pending')`;
//           pool.query(insertCustom, [userID, customTotal], (err, customRes) => {
//             if (err) return res.status(500).json({ message: "Custom order failed" });

//             customOrderID = customRes.insertId;
//             const customItems = customResults.map(item => [
//               customOrderID, item.CustomProductID, item.Quantity, item.LineTotal
//             ]);

//             pool.query(`INSERT INTO CustomOrderItems (CustomOrderID, CustomProductID, Quantity, Subtotal) VALUES ?`,
//               [customItems], (err) => {
//                 if (err) return res.status(500).json({ message: "Insert custom items failed" });
//                 insertMasterOrder();
//               });
//           });
//         };

//         if (mainResults.length === 0) return insertCustomIfAny();

//         const insertMain = `INSERT INTO MainOrders (OrderDate, OrderStatus, OrderTotalAmount, UserID) VALUES (NOW(), 'Pending', ?, ?)`;
//         pool.query(insertMain, [mainTotal, userID], (err, mainRes) => {
//           if (err) return res.status(500).json({ message: "Main order failed" });

//           mainOrderID = mainRes.insertId;
//           const mainItems = mainResults.map(item => [
//             item.Quantity, item.LineTotal, mainOrderID, item.ProductID
//           ]);

//           pool.query(`INSERT INTO MainOrderItem (OrderedItemQuantity, LineTotal, MainOrderID, ProductID) VALUES ?`,
//             [mainItems], (err) => {
//               if (err) return res.status(500).json({ message: "Insert main items failed" });
//               insertCustomIfAny();
//             });
//         });
//       });
//     });
//   } catch (err) {
//     console.error("❌ Lookup error:", err.response?.data || err.message);
//     return res.status(500).json({ message: "Khalti lookup failed" });
//   }
// };

const verifyKhaltiPayment = async (req, res) => {
  const { pidx, amount, pendingCheckout } = req.body;

  if (!pidx || !amount || !pendingCheckout || !pendingCheckout.userID) {
    return res.status(400).json({ message: "Missing fields for verification" });
  }

  try {
    console.log("🔍 Verifying Khalti payment with PIDX:", pidx);

    // Step 1: Lookup payment on Khalti
    const lookupRes = await axios.post(
      "https://dev.khalti.com/api/v2/epayment/lookup/",
      { pidx },
      {
        headers: {
          Authorization: "Key c90ee672cb4d43b79da7f220c2c2ca1a", // 🔑 your secret key
          "Content-Type": "application/json",
        },
      }
    );

    const { status } = lookupRes.data;
    if (status !== "Completed") {
      return res.status(400).json({ message: `Payment status: ${status}` });
    }

    // Step 2: Check if payment already saved (prevents duplicate order)
    const checkQuery = `SELECT MasterOrderID FROM Payment WHERE PaymentDescription = ?`;
    const checkResult = await new Promise((resolve, reject) => {
      pool.query(checkQuery, [pidx], (err, result) => {
        if (err) return reject(err);
        return resolve(result);
      });
    });

    if (checkResult.length > 0) {
      console.log("⚠️ Payment already recorded. Skipping order creation.");
      return res.status(200).json({ message: "Order already processed", masterOrderID: checkResult[0].MasterOrderID });
    }

    // Step 3: Proceed with order creation
    const { userID, deliveryMethod, paymentMethod, deliveryAddress } = pendingCheckout;

    const fetchMainCart = `SELECT ProductID, Quantity, LineTotal FROM MainCartItem WHERE UserID = ? AND CartStatus = 'active'`;
    const fetchCustomCart = `SELECT CustomProductID, Quantity, LineTotal FROM CustomCartItem WHERE UserID = ? AND CartStatus = 'active'`;

    pool.query(fetchMainCart, [userID], (err, mainResults) => {
      if (err) return res.status(500).json({ message: "Error fetching main cart" });

      pool.query(fetchCustomCart, [userID], (err, customResults) => {
        if (err) return res.status(500).json({ message: "Error fetching custom cart" });

        const mainTotal = mainResults.reduce((sum, item) => sum + parseFloat(item.LineTotal), 0);
        const customTotal = customResults.reduce((sum, item) => sum + parseFloat(item.LineTotal), 0);
        const subTotal = mainTotal + customTotal;
        const shipping = deliveryMethod === "Delivery" ? 100 : 0;
        const grandTotal = subTotal + shipping;

        let mainOrderID = null;
        let customOrderID = null;

        const insertMasterOrder = () => {
          const insertMaster = `
            INSERT INTO MasterOrder (
              MainOrderID, CustomOrderID, Status, OrderDate,
              DeliveryMethod, PaymentMethod, DeliveryAddress,
              ExpectedDeliveryDate, SubTotal, ShippingCharge, GrandTotal
            ) VALUES (?, ?, 'Pending', NOW(), ?, ?, ?, DATE_ADD(NOW(), INTERVAL 30 MINUTE), ?, ?, ?)
          `;

          pool.query(insertMaster, [
            mainOrderID,
            customOrderID,
            deliveryMethod,
            paymentMethod,
            deliveryAddress,
            subTotal,
            shipping,
            grandTotal
          ], (err, masterRes) => {
            if (err) return res.status(500).json({ message: "Master order failed" });

            const masterOrderID = masterRes.insertId;

            // Step 4: Save payment now
            const insertPayment = `
              INSERT INTO Payment (MasterOrderID, UserID, PaymentAmount, PaymentStatus, PaymentMethod, PaymentDescription)
              VALUES (?, ?, ?, 'Completed', 'Khalti', ?)
            `;

            pool.query(insertPayment, [masterOrderID, userID, amount, pidx], (err) => {
              if (err) return res.status(500).json({ message: "Payment insert failed" });

              // Clean up cart
              pool.query(`DELETE FROM MainCartItem WHERE UserID = ?`, [userID]);
              pool.query(`DELETE FROM CustomCartItem WHERE UserID = ?`, [userID]);

              return res.status(200).json({ message: "✅ Order & payment saved", masterOrderID });
            });
          });
        };

        const insertCustomIfAny = () => {
          if (customResults.length === 0) return insertMasterOrder();

          const insertCustom = `INSERT INTO CustomOrders (UserID, OrderDate, TotalPrice, Status) VALUES (?, NOW(), ?, 'Pending')`;
          pool.query(insertCustom, [userID, customTotal], (err, customRes) => {
            if (err) return res.status(500).json({ message: "Custom order failed" });

            customOrderID = customRes.insertId;
            const customItems = customResults.map(item => [
              customOrderID, item.CustomProductID, item.Quantity, item.LineTotal
            ]);

            pool.query(`INSERT INTO CustomOrderItems (CustomOrderID, CustomProductID, Quantity, Subtotal) VALUES ?`,
              [customItems], (err) => {
                if (err) return res.status(500).json({ message: "Insert custom items failed" });
                insertMasterOrder();
              });
          });
        };

        if (mainResults.length === 0) return insertCustomIfAny();

        const insertMain = `INSERT INTO MainOrders (OrderDate, OrderStatus, OrderTotalAmount, UserID) VALUES (NOW(), 'Pending', ?, ?)`;
        pool.query(insertMain, [mainTotal, userID], (err, mainRes) => {
          if (err) return res.status(500).json({ message: "Main order failed" });

          mainOrderID = mainRes.insertId;
          const mainItems = mainResults.map(item => [
            item.Quantity, item.LineTotal, mainOrderID, item.ProductID
          ]);

          pool.query(`INSERT INTO MainOrderItem (OrderedItemQuantity, LineTotal, MainOrderID, ProductID) VALUES ?`,
            [mainItems], (err) => {
              if (err) return res.status(500).json({ message: "Insert main items failed" });
              insertCustomIfAny();
            });
        });
      });
    });
  } catch (err) {
    console.error("❌ Lookup error:", err.response?.data || err.message);
    return res.status(500).json({ message: "Khalti lookup failed" });
  }
};







module.exports = { 
  initiateKhaltiPayment,
  lookupKhaltiPayment,
  verifyKhaltiPayment,
  estimateOrderTotal
 };

