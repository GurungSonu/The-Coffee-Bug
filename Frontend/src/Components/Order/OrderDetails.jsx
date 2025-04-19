import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const OrderDetail = () => {
  const { masterOrderID } = useParams();
  const [details, setDetails] = useState(null);
  const [reviewedProductIds, setReviewedProductIds] = useState([]);
  const [productReviews, setProductReviews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const printRef = useRef();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/order/details/${masterOrderID}`);
        
        if (!res.data || Object.keys(res.data).length === 0) {
          console.warn("⚠️ Order details missing or empty");
          return;
        }

        console.log("📦 Order details with timestamps:", res.data);
        setDetails(res.data);

        const authData = JSON.parse(localStorage.getItem("authData"));
        const userID = authData?.userId;

        if (res.data.Status === "Delivered" && userID) {
          const reviewRes = await axios.get(`http://localhost:5000/api/review/user/${userID}/order/${masterOrderID}`);
          console.log("📦 Reviews from DB:", reviewRes.data);
          setReviewedProductIds(reviewRes.data.map((r) => r.ProductID));
          setProductReviews(reviewRes.data);
        }
      } catch (err) {
        console.error("❌ Failed to fetch order details or reviews", err.response?.data || err.message);
      }
    };

    if (masterOrderID) {
      setTimeout(() => fetchDetail(), 800); // ⏱️ Small delay to ensure backend completes
    }
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

  const handleReviewSubmit = async () => {
    const authData = JSON.parse(localStorage.getItem("authData"));
    const userID = authData?.userId;

    if (!masterOrderID || !currentProduct?.productID || !userID || rating < 1) {
      alert("Please complete all review fields");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/review/", {
        masterOrderID,
        productID: currentProduct.productID,
        userID,
        rating,
        reviewText,
      });

      console.log("✅ Review submitted to backend:", res.data);

      const reviewRes = await axios.get(
        `http://localhost:5000/api/review/user/${userID}/order/${masterOrderID}`
      );

      setReviewedProductIds(reviewRes.data.map((r) => r.ProductID));
      setProductReviews(reviewRes.data);

      setShowModal(false);
      setRating(0);
      setReviewText("");
      alert("✅ Review submitted!");
    } catch (err) {
      console.error("❌ Failed to submit review", err.response?.data || err.message);
      alert("Failed to submit review");
    }
  };

  if (!details) return <p>Loading...</p>;

  const subTotal = [
    ...(details.mainItems || []).map((i) => parseFloat(i.LineTotal)),
    ...(details.customItems || []).map((i) => parseFloat(i.Subtotal)),
  ].reduce((a, b) => a + b, 0);

  const shippingCharge = details.DeliveryMethod === "Delivery" ? 100 : 0;
  const grandTotal = subTotal + shippingCharge;

  const formatDate = (iso) =>
    iso
      ? new Date(iso).toLocaleString("en-US", {
          timeZone: "Asia/Kathmandu",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "N/A";

  return (
    <div className="p-6">
      <div ref={printRef} className="bg-white p-4 shadow rounded">
        <h2 className="text-2xl font-bold mb-4">Order #{masterOrderID} Details</h2>
        <p><strong>Order Status:</strong> {details?.Status || "N/A"}</p>
        <p><strong>Delivery Method:</strong> {details?.DeliveryMethod || "N/A"}</p>
        <p><strong>Payment Method:</strong> {details?.PaymentMethod || "N/A"}</p>
        <p><strong>Payment Status:</strong> {details?.PaymentStatus || "N/A"}</p>


        {details?.DeliveryMethod === "Delivery" && (
          <>
            <p><strong>Delivery Address:</strong> {details?.DeliveryAddress || "N/A"}</p>
            <p><strong>Expected Delivery:</strong> {formatDate(details?.ExpectedDeliveryDate)}</p>
          </>
        )}

        <div className="mt-4">
          <h3 className="font-semibold">Delivery Progress</h3>
          <ul className="text-sm ml-4 list-disc mt-2">
  <li>Order Placed: {formatDate(details.orderPlacedAt)}</li>
  <li>Preparing: {formatDate(details.PreparingAt)}</li>
  {details.DeliveryMethod === "Delivery" ? (
    <>
      <li>Out for Delivery: {formatDate(details.OutForDeliveryAt)}</li>
      <li>Delivered: {formatDate(details.DeliveredAt)}</li>
    </>
  ) : (
    <>
      <li>Ready for Pickup: {formatDate(details.ReadyForPickupAt)}</li>
      <li>Picked Up: {formatDate(details.PickedUpAt)}</li>
    </>
  )}
</ul>

        </div>

        <h3 className="text-lg font-semibold mt-6 mb-2">Standard Products</h3>
        {details.mainItems?.length > 0 ? (
          details.mainItems.map((item, idx) => {
            const review = productReviews.find((r) => r.ProductID === item.ProductID);
            return (
              <div key={idx} className="mb-2 border-b pb-2">
                <p>{item.ProductName}</p>
                <p>Quantity: {item.OrderedItemQuantity}</p>
                <p>Line Total: Rs {item.LineTotal}</p>

                {review ? (
                  <div className="mt-1 text-sm text-green-700">
                    ✅ Your Review: ⭐ {review.Rating}
                    <br />
                    <i>{review.ReviewText || "No comment"}</i>
                  </div>
                ) : (details.Status === "Delivered" || details.Status === "Picked Up") ? (
                  <button
                    className="mt-2 text-blue-600 hover:underline"
                    onClick={() => {
                      setCurrentProduct({
                        productID: item.ProductID,
                        productName: item.ProductName,
                      });
                      setShowModal(true);
                    }}
                  >
                    ⭐ Leave a Review
                  </button>
                ) : null}
              </div>
            );
          })
        ) : (
          <p>No standard items.</p>
        )}

        <h3 className="text-lg font-semibold mt-6 mb-2">Custom Products</h3>
        {details.customItems?.length > 0 ? (
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
          {details.DeliveryMethod === "Delivery" && (
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

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-2">Review for {currentProduct?.productName}</h3>
            <label className="block mb-1">Rating (1–5)</label>
            <input
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full border px-3 py-2 mb-3 rounded"
            />
            <textarea
              placeholder="Write your review (optional)"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full border px-3 py-2 mb-3 rounded"
            />
            <div className="flex gap-4">
              <button
                onClick={handleReviewSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Submit Review
              </button>
              <button
                className="text-sm text-gray-600 hover:underline"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetail;
