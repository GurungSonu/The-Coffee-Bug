import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const OrderDetails = () => {
  const { orderID } = useParams();  // Get orderID from URL params
  const [orderDetails, setOrderDetails] = useState([]);

  useEffect(() => {
    console.log(`Fetching order details for Order ID: ${orderID}`); // Debugging
  
    axios.get(`http://localhost:5000/api/orders/orderDetails/${orderID}`)
      .then(res => {
        console.log("🟢 Order Details Response:", res.data); // Log response data
        setOrderDetails(res.data);
      })
      .catch(err => {
        console.error("🔴 Error fetching order details:", err);
      });
  }, [orderID]);
  

  return (
    <div>
      <h2>Order #{orderID} Details</h2>
      {orderDetails.length === 0 ? <p>No items found</p> : (
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {orderDetails.map((item, index) => (
              <tr key={index}>
                <td>{item.ProductName}</td>
                <td>{item.OrderedItemQuantity}</td>
                <td>${item.ProductPrice}</td>
                <td>${item.LineTotal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderDetails;
