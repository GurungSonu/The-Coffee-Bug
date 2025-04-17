import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const OrderDetail = () => {
  const { masterOrderID } = useParams();
  const [details, setDetails] = useState(null);
  const printRef = useRef();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/order/details/${masterOrderID}`);
        setDetails(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch order details", err.response || err.message);
      }
    };
    if (masterOrderID) fetchDetail();
  }, [masterOrderID]);

  const generatePDF = () => {
    const input = printRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Order_${masterOrderID}_Receipt.pdf`);
    });
  };

  if (!details) return <p>Loading...</p>;

  const subTotal = [
    ...details.mainItems.map(i => parseFloat(i.LineTotal)),
    ...details.customItems.map(i => parseFloat(i.Subtotal))
  ].reduce((a, b) => a + b, 0);

  const shippingCharge = details.deliveryMethod === 'Delivery' ? 100 : 0;
  const grandTotal = subTotal + shippingCharge;

  return (
    <div className="p-6">
      <div ref={printRef} className="bg-white p-4 shadow rounded">
        <h2 className="text-2xl font-bold mb-4">Order #{masterOrderID} Details</h2>
        <p><strong>Status:</strong> {details.status}</p>
        <p><strong>Delivery Method:</strong> {details.deliveryMethod}</p>
        <p><strong>Payment Method:</strong> {details.paymentMethod}</p>

        {details.deliveryMethod === "Delivery" && (
          <>
            <p><strong>Delivery Address:</strong> {details.deliveryAddress}</p>
            <p><strong>Expected Delivery:</strong> {new Date(details.expectedDeliveryDate).toLocaleString()}</p>
          </>
        )}

        <h3 className="text-lg font-semibold mt-6 mb-2">Standard Products</h3>
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

        <h3 className="text-lg font-semibold mt-6 mb-2">Custom Products</h3>
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

        <hr className="my-4" />
        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-semibold">Order Summary</h3>
          <p><strong>SubTotal:</strong> Rs {subTotal.toFixed(2)}</p>
          {details.deliveryMethod === 'Delivery' && (
            <p><strong>Shipping Charge:</strong> Rs 100.00</p>
          )}
          <p className="mt-2 text-lg font-bold">
            Grand Total: Rs {grandTotal.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Print Receipt
        </button>
        <button
          onClick={generatePDF}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default OrderDetail;
