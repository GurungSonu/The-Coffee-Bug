// // src/pages/KhaltiSuccess.jsx
// import React, { useEffect } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";

// const KhaltiSuccess = () => {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const pidx = searchParams.get("pidx");

//   const authData = JSON.parse(localStorage.getItem("authData"));
//   const token = authData?.token;

//   useEffect(() => {
//     if (!pidx) {
//       toast.error("Missing payment reference.");
//       return navigate("/");
//     }

//     // ✅ Prevent duplicate submission
//     const alreadyProcessed = localStorage.getItem("orderPlacedForPidx");
//     if (alreadyProcessed === pidx) {
//       toast.info("✅ Payment already processed!");
//       return navigate("/orderList");
//     }

//     const finalizeOrder = async () => {
//       try {
//         console.log("🔍 Verifying payment with pidx:", pidx);

//         const lookupRes = await axios.post("http://localhost:5000/api/payment/lookup-payment", { pidx });
//         const status = lookupRes.data?.status;
//         const amount = lookupRes.data?.total_amount / 100;

//         console.log("📦 Lookup response:", lookupRes.data);

//         if (status === "Completed") {
//           const pendingCheckout = JSON.parse(localStorage.getItem("pendingCheckout"));
//           console.log("🧾 Checkout Info:", pendingCheckout);

//           if (!pendingCheckout?.userID) {
//             toast.error("Missing checkout data.");
//             return navigate("/");
//           }

//           // ✅ Step 1: Place order
//           const orderRes = await axios.post(
//             "http://localhost:5000/api/order/orders/checkout",
//             pendingCheckout,
//             { headers: { Authorization: `Bearer ${token}` } }
//           );

//           const masterOrderID = orderRes.data.masterOrderID;

//           // ✅ Step 2: Save payment
//           await axios.post("http://localhost:5000/api/payment/verify-payment", {
//             pidx,
//             masterOrderID,
//             userID: pendingCheckout.userID,
//             amount
//           });

//           toast.success("✅ Payment verified & order placed!");
//           localStorage.setItem("orderPlacedForPidx", pidx);
//           localStorage.removeItem("pendingCheckout");
//           navigate("/orderList");
//         } else {
//           toast.error(`❌ Payment not completed. Status: ${status}`);
//           navigate("/");
//         }
//       } catch (err) {
//         console.error("❌ Error during finalization:", err.response?.data || err.message);
//         toast.error("Something went wrong during payment verification.");
//         navigate("/");
//       }
//     };

//     finalizeOrder();
//   }, [navigate, pidx, token]);

//   return <div className="p-6">Verifying payment and placing order...</div>;
// };

// export default KhaltiSuccess;

// src/pages/KhaltiSuccess.jsx
// import React, { useEffect } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";

// const KhaltiSuccess = () => {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const pidx = searchParams.get("pidx");

//   const authData = JSON.parse(localStorage.getItem("authData"));
//   const token = authData?.token;

//   useEffect(() => {
//     if (!pidx) {
//       toast.error("Missing payment reference.");
//       return navigate("/");
//     }

//     // ✅ Prevent duplicate frontend submission
//     const alreadyProcessed = localStorage.getItem("orderPlacedForPidx");
//     if (alreadyProcessed === pidx) {
//       toast.info("✅ Payment already processed!");
//       return navigate("/orderList");
//     }
// // pleaseeeee
//     // const finalizeOrder = async () => {
//     //   try {
//     //     console.log("🔍 Verifying payment with pidx:", pidx);

//     //     const lookupRes = await axios.post("http://localhost:5000/api/payment/lookup-payment", { pidx });
//     //     const status = lookupRes.data?.status;
//     //     const amount = lookupRes.data?.total_amount / 100;

//     //     if (status === "Completed") {
//     //       const pendingCheckout = JSON.parse(localStorage.getItem("pendingCheckout"));

//     //       if (!pendingCheckout?.userID) {
//     //         toast.error("Missing checkout data.");
//     //         return navigate("/");
//     //       }

//     //       // ✅ Attach pidx before sending to backend
//     //       pendingCheckout.pidx = pidx;

//     //       // Step 1: Create Order
//     //       const orderRes = await axios.post(
//     //         "http://localhost:5000/api/order/orders/checkout",
//     //         pendingCheckout,
//     //         { headers: { Authorization: `Bearer ${token}` } }
//     //       );

//     //       const masterOrderID = orderRes.data.masterOrderID;

//     //       // Step 2: Save payment
//     //       await axios.post("http://localhost:5000/api/payment/verify-payment", {
//     //         pidx,
//     //         masterOrderID,
//     //         userID: pendingCheckout.userID,
//     //         amount,
//     //       });

//     //       toast.success("✅ Payment verified & order placed!");
//     //       localStorage.setItem("orderPlacedForPidx", pidx);
//     //       localStorage.removeItem("pendingCheckout");
//     //       navigate("/orderList");
//     //     } else {
//     //       toast.error(`❌ Payment not completed. Status: ${status}`);
//     //       navigate("/");
//     //     }
//     //   } catch (err) {
//     //     console.error("❌ Error during finalization:", err.response?.data || err.message);
//     //     toast.error("Something went wrong during payment verification.");
//     //     navigate("/");
//     //   }
//     // };
//     const finalizeOrder = async () => {
//       try {
//         const lookupRes = await axios.post("http://localhost:5000/api/payment/lookup-payment", { pidx });
//         const status = lookupRes.data?.status;
//         const amount = lookupRes.data?.total_amount / 100;
    
//         console.log("📦 Lookup response:", lookupRes.data);
    
//         if (status === "Completed") {
//           const pendingCheckout = JSON.parse(localStorage.getItem("pendingCheckout"));
    
//           if (!pendingCheckout?.userID) {
//             toast.error("Missing checkout data.");
//             return navigate("/");
//           }
    
//           // ✅ Attach pidx to avoid duplicate orders
//           pendingCheckout.pidx = pidx;
    
//           // Step 1: Create Order FIRST
//           const orderRes = await axios.post(
//             "http://localhost:5000/api/order/orders/checkout",
//             pendingCheckout,
//             { headers: { Authorization: `Bearer ${token}` } }
//           );
    
//           const masterOrderID = orderRes.data.masterOrderID;
    
//           // Step 2: Save payment AFTER order is placed
//           // await axios.post("http://localhost:5000/api/payment/verify-payment", {
//           //   pidx,
//           //   masterOrderID,
//           //   userID: pendingCheckout.userID,
//           //   amount,
//           await axios.post("http://localhost:5000/api/payment/verify-payment", {
//             pidx,
//             amount,
//             pendingCheckout
//           });
          
  
    
//           toast.success("✅ Order placed & payment verified!");
//           localStorage.setItem("orderPlacedForPidx", pidx);
//           localStorage.removeItem("pendingCheckout");
//           navigate("/orderList");
//         } else {
//           toast.error(`❌ Payment not completed. Status: ${status}`);
//           navigate("/");
//         }
//       } catch (err) {
//         console.error("❌ Finalization error:", err.response?.data || err.message);
//         toast.error("Something went wrong during payment verification.");
//         navigate("/");
//       }
//     };
    
    
//     finalizeOrder();
//   }, [navigate, pidx, token]);

//   return <div className="p-6">Verifying payment and placing order...</div>;
// };

// export default KhaltiSuccess;



// import React, { useEffect } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";

// const KhaltiSuccess = () => {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const pidx = searchParams.get("pidx");

//   const authData = JSON.parse(localStorage.getItem("authData"));
//   const token = authData?.token;

//   useEffect(() => {
//     if (!pidx) {
//       toast.error("Missing payment reference.");
//       return navigate("/");
//     }

//     // ✅ Prevent duplicate frontend submission
//     const alreadyProcessed = localStorage.getItem("orderPlacedForPidx");
//     if (alreadyProcessed === pidx) {
//       toast.info("✅ Payment already processed!");
//       return navigate("/orderList");
//     }

//     // const finalizeOrder = async () => {
//     //   try {
//     //     // Step 1: Lookup payment
//     //     const lookupRes = await axios.post("http://localhost:5000/api/payment/lookup-payment", { pidx });
//     //     const status = lookupRes.data?.status;
//     //     const amount = lookupRes.data?.total_amount / 100;

//     //     if (status !== "Completed") {
//     //       toast.error(`❌ Payment not completed. Status: ${status}`);
//     //       return navigate("/");
//     //     }

//     //     const pendingCheckout = JSON.parse(localStorage.getItem("pendingCheckout"));
//     //     if (!pendingCheckout?.userID) {
//     //       toast.error("Missing checkout data.");
//     //       return navigate("/");
//     //     }

//     //     // ✅ Step 2: Send everything to verify-payment (order + payment)
//     //     await axios.post("http://localhost:5000/api/payment/verify-payment", {
//     //       pidx,
//     //       amount,
//     //       pendingCheckout,
//     //     });

//     //     toast.success("✅ Payment verified & order placed!");
//     //     localStorage.setItem("orderPlacedForPidx", pidx);
//     //     localStorage.removeItem("pendingCheckout");
//     //     navigate("/orderList");
//     //   } catch (err) {
//     //     console.error("❌ Finalization error:", err.response?.data || err.message);
//     //     toast.error("Something went wrong during payment verification.");
//     //     navigate("/");
//     //   }
//     // };


//     const finalizeOrder = async () => {
//       try {
//         const lookupRes = await axios.post("http://localhost:5000/api/payment/lookup-payment", { pidx });
//         const status = lookupRes.data?.status;
//         const amount = lookupRes.data?.total_amount / 100;
    
//         if (status === "Completed") {
//           const pendingCheckout = JSON.parse(localStorage.getItem("pendingCheckout"));
//           if (!pendingCheckout?.userID) {
//             toast.error("Missing checkout data.");
//             return navigate("/");
//           }
    
//           // ✅ Send everything to backend only ONCE via /verify-payment
//           const res = await axios.post("http://localhost:5000/api/payment/verify-payment", {
//             pidx,
//             amount,
//             pendingCheckout,
//           });
    
//           const masterOrderID = res.data.masterOrderID;
    
//           toast.success("✅ Payment verified & order placed!");
//           localStorage.setItem("orderPlacedForPidx", pidx);
//           localStorage.removeItem("pendingCheckout");
    
//           // Optional: add slight delay before navigating
//           setTimeout(() => {
//             navigate(`/orderList`);
//           }, 1000);
//         } else {
//           toast.error(`❌ Payment not completed. Status: ${status}`);
//           navigate("/");
//         }
//       } catch (err) {
//         console.error("❌ Error during payment finalization:", err.response?.data || err.message);
//         toast.error("Something went wrong during payment verification.");
//         navigate("/");
//       }
//     };
    
//     finalizeOrder();
//   }, [navigate, pidx, token]);

//   return <div className="p-6">Verifying payment and placing order...</div>;
// };

// export default KhaltiSuccess;

import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const KhaltiSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const pidx = searchParams.get("pidx");

  useEffect(() => {
    if (!pidx) {
      toast.error("Missing payment reference.");
      return navigate("/");
    }

    const alreadyProcessed = localStorage.getItem("orderPlacedForPidx");

    // ⛔ EARLY BLOCK for duplicate pidx calls
    if (alreadyProcessed === pidx) {
      toast.info("✅ Payment already processed!");
      return navigate("/orderList");
    }

    const finalizeOrder = async () => {
      try {
        // ✅ Immediately mark pidx as being processed to prevent double call
        localStorage.setItem("orderPlacedForPidx", pidx);

        const lookupRes = await axios.post("http://localhost:5000/api/payment/lookup-payment", { pidx });
        const status = lookupRes.data?.status;
        const amount = lookupRes.data?.total_amount / 100;

        if (status === "Completed") {
          const pendingCheckout = JSON.parse(localStorage.getItem("pendingCheckout"));
          if (!pendingCheckout?.userID) {
            toast.error("Missing checkout data.");
            localStorage.removeItem("orderPlacedForPidx"); // rollback flag
            return navigate("/");
          }

          const res = await axios.post("http://localhost:5000/api/payment/verify-payment", {
            pidx,
            amount,
            pendingCheckout,
          });

          const masterOrderID = res.data.masterOrderID;

          toast.success("✅ Payment verified & order placed!");
          localStorage.removeItem("pendingCheckout");

          setTimeout(() => navigate(`/order/${masterOrderID}`), 1000);
        } else {
          toast.error(`❌ Payment not completed. Status: ${status}`);
          localStorage.removeItem("orderPlacedForPidx"); // rollback flag
          navigate("/");
        }
      } catch (err) {
        console.error("❌ Finalization error:", err.response?.data || err.message);
        toast.error("Something went wrong during payment verification.");
        localStorage.removeItem("orderPlacedForPidx"); // rollback flag
        navigate("/");
      }
    };

    finalizeOrder();
  }, [navigate, pidx]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-50 text-center px-4">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-green-700 mb-2">✅ Order Confirmed!</h2>
        <p className="text-gray-700 mb-4">
          Your payment was successful and your order has been placed.
        </p>
        <button
          onClick={() => navigate("/orderList")}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          View Your Orders
        </button>
      </div>
    </div>
  );
  
};

export default KhaltiSuccess;

