import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminOrderManager = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/order/admin/orders");
      setOrders(res.data);
      console.log("📦 Orders fetched:", res.data);
    } catch (err) {
      console.error("❌ Failed to fetch orders", err);
    }
  };

  const updateStatus = async (id, newStatus) => {
    console.log(`📝 Updating order ${id} to status: ${newStatus}`);
    try {
      const res = await axios.put(`http://localhost:5000/api/order/admin/orders/${id}/status`, {
        status: newStatus,
      });
      console.log("✅ Status updated:", res.data);
      fetchOrders(); // refresh data
    } catch (err) {
      console.error("❌ Failed to update order status", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🛠 Admin Order Management</h2>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
          <thead>
  <tr className="bg-gray-100">
    <th className="border px-3 py-2">Order ID</th>
    <th className="border px-3 py-2">Customer Name</th>
    <th className="border px-3 py-2">Email</th>
    <th className="border px-3 py-2">Phone</th>
    <th className="border px-3 py-2">Delivery Address</th>
    <th className="border px-3 py-2">Standard Items</th>
    <th className="border px-3 py-2">Custom Products</th>
    <th className="border px-3 py-2">Custom Ingredients</th>
    <th className="border px-3 py-2">Status</th>
    <th className="border px-3 py-2">Date</th>
    <th className="border px-3 py-2">Delivery</th>
    <th className="border px-3 py-2">Payment</th>
    <th className="border px-3 py-2">Total</th>
    <th className="border px-3 py-2">Actions</th>
  </tr>
</thead>

<tbody>
  {orders.map((order) => (
    <tr key={order.MasterOrderID}>
      <td className="border px-3 py-2">{order.MasterOrderID}</td>
      <td className="border px-3 py-2">{order.CustomerName || "-"}</td>
      <td className="border px-3 py-2">{order.Email || "-"}</td>
      <td className="border px-3 py-2">{order.PhoneNumber || "-"}</td>
      <td className="border px-3 py-2">{order.DeliveryAddress || "N/A"}</td>
      <td className="border px-3 py-2 whitespace-pre-wrap">{order.StandardItems || "—"}</td>
      <td className="border px-3 py-2 whitespace-pre-wrap">{order.CustomProducts || "—"}</td>
      <td className="border px-3 py-2 whitespace-pre-wrap">{order.CustomIngredients || "—"}</td>
      <td className="border px-3 py-2 font-semibold text-blue-700">{order.Status}</td>
      <td className="border px-3 py-2">{new Date(order.OrderDate).toLocaleString()}</td>
      <td className="border px-3 py-2">{order.DeliveryMethod}</td>
      <td className="border px-3 py-2">{order.PaymentMethod}</td>
      <td className="border px-3 py-2">Rs {order.GrandTotal}</td>
      
      <td className="border px-3 py-2 space-y-1">
                    {/* Delivery flow */}
                    {order.DeliveryMethod === "Delivery" && order.Status !== "Delivered" && (
                      <>
                        {order.Status !== "Preparing" && (
                          <button
                            onClick={() => updateStatus(order.MasterOrderID, "Preparing")}
                            className="block w-full px-2 py-1 text-xs bg-yellow-400 rounded"
                          >
                            Mark Preparing
                          </button>
                        )}
                        {order.Status !== "Out for Delivery" && (
                          <button
                            onClick={() => updateStatus(order.MasterOrderID, "Out for Delivery")}
                            className="block w-full px-2 py-1 text-xs bg-orange-400 rounded"
                          >
                            Out for Delivery
                          </button>
                        )}
                        {order.Status !== "Delivered" && (
                          <button
                            onClick={() => updateStatus(order.MasterOrderID, "Delivered")}
                            className="block w-full px-2 py-1 text-xs bg-green-500 text-white rounded"
                          >
                            Mark Delivered
                          </button>
                        )}
                      </>
                    )}

                    {/* Pickup flow */}
                    {order.DeliveryMethod === "Pickup" && order.Status !== "Picked Up" && (
                      <>
                        {order.Status !== "Preparing" && (
                          <button
                            onClick={() => updateStatus(order.MasterOrderID, "Preparing")}
                            className="block w-full px-2 py-1 text-xs bg-yellow-400 rounded"
                          >
                            Mark Preparing
                          </button>
                        )}
                        {order.Status !== "Ready for Pickup" && (
                          <button
                            onClick={() => updateStatus(order.MasterOrderID, "Ready for Pickup")}
                            className="block w-full px-2 py-1 text-xs bg-purple-500 text-white rounded"
                          >
                            Ready for Pickup
                          </button>
                        )}
                        {order.Status !== "Picked Up" && (
                          <button
                            onClick={() => updateStatus(order.MasterOrderID, "Picked Up")}
                            className="block w-full px-2 py-1 text-xs bg-green-600 text-white rounded"
                          >
                            Mark Picked Up
                          </button>
                        )}
                      </>
                    )}
                  </td>
        {/* Action buttons (unchanged) */}
        {/* ... */}
      
    </tr>
  ))}
</tbody>

          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrderManager;
