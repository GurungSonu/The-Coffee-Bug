import React, { useEffect, useState } from "react";
import axios from "axios";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const userID = JSON.parse(localStorage.getItem("authData"))?.userId;
  const token = JSON.parse(localStorage.getItem("authData"))?.token;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/order/history/${userID}`, {
          headers: { Authorization: `Bearer ${token}` },
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
      {orders.map((order) => (
        <div key={order.MasterOrderID} className="border p-4 rounded mb-4 shadow-sm">
          <h3 className="text-lg font-semibold">Order #{order.MasterOrderID}</h3>
          <p>Date: {new Date(order.OrderDate).toLocaleString()}</p>
          <p>Status: {order.MasterStatus}</p>
          <p>Main Order Total: Rs {order.MainTotal || 0}</p>
          <p>Custom Order Total: Rs {order.CustomTotal || 0}</p>
        </div>
      ))}
    </div>
  );
};

export default OrderList;
