


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";

// const OrderList = () => {
//   const [orders, setOrders] = useState([]);
//   const authData = JSON.parse(localStorage.getItem("authData"));
//   const userID = authData?.userId;
//   const token = authData?.token;

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const res = await axios.get(`http://localhost:5000/api/order/history/${userID}`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         setOrders(res.data);
//       } catch (err) {
//         console.error("Failed to fetch orders", err);
//       }
//     };
//     fetchOrders();
//   }, []);
  

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
//       {orders.map(order => (
//         <Link to={`/orders/${order.MasterOrderID}`} key={order.MasterOrderID}>
//           <div className="border p-4 rounded mb-4 shadow hover:bg-gray-50 transition">
//             <h3 className="text-lg font-semibold">Order #{order.MasterOrderID}</h3>
//             <p>Date: {new Date(order.OrderDate).toLocaleString()}</p>
//             <p>Status: {order.Status}</p>
//             <p>Main Order Total: Rs {order.MainTotal || 0}</p>
//             <p>Custom Order Total: Rs {order.CustomTotal || 0}</p>
//             <p>Delivery Method: {order.DeliveryMethod}</p>
//             <p>Payment Method: {order.PaymentMethod}</p>
//           </div>
//         </Link>
//       ))}
//     </div>
//   );
// };

// export default OrderList;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const authData = JSON.parse(localStorage.getItem("authData"));
  const userID = authData?.userId;
  const token = authData?.token;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/order/history/${userID}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
      {orders.map(order => (
        <Link to={`/orders/${order.MasterOrderID}`} key={order.MasterOrderID}>
          <div className="border p-4 rounded mb-4 shadow hover:bg-gray-50 transition">
            <h3 className="text-lg font-semibold">Order #{order.MasterOrderID}</h3>
            <p>Date: {new Date(order.OrderDate).toLocaleString()}</p>
            <p> Status: {order.MasterStatus || "Pending"}</p>
            <p>Main Order Total: Rs {order.MainTotal || 0}</p>
            <p>Custom Order Total: Rs {order.CustomTotal || 0}</p>
            <p>Delivery Method: {order.DeliveryMethod}</p>
            <p>Payment Method: {order.PaymentMethod}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default OrderList;
