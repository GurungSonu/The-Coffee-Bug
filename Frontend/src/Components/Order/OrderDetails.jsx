import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const OrderDetail = () => {
  const { masterOrderID } = useParams();
  const [details, setDetails] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/order/orders/detail/${masterOrderID}`);
        setDetails(res.data);
      } catch (err) {
        console.error("Failed to fetch order details", err);
      }
    };
    fetchDetail();
  }, [masterOrderID]);

  if (!details) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Order #{details.masterOrderID} Details</h2>

      <h3 className="text-lg font-semibold mb-2">Standard Products</h3>
      {details.mainItems.length > 0 ? (
        details.mainItems.map((item, idx) => (
          <div key={idx} className="mb-2 border-b pb-2">
            <p>{item.ProductName}</p>
            <p>Quantity: {item.OrderedItemQuantity}</p>
            <p>Line Total: Rs {item.LineTotal}</p>
          </div>
        ))
      ) : (
        <p>No standard items.</p>
      )}

      <h3 className="text-lg font-semibold mt-4 mb-2">Custom Products</h3>
      {details.customItems.length > 0 ? (
        details.customItems.map((item, idx) => (
          <div key={idx} className="mb-2 border-b pb-2">
            <p>{item.ProductName}</p>
            <p>Quantity: {item.Quantity}</p>
            <p>Subtotal: Rs {item.Subtotal}</p>
          </div>
        ))
      ) : (
        <p>No custom items.</p>
      )}
    </div>
  );
};

export default OrderDetail;
