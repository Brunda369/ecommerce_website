import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../../config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useToast } from '../../contexts/toastCore';

export default function OrderDetails() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchOrder = async () => {
      const orderRef = doc(db, "orders", orderId);
      const orderSnap = await getDoc(orderRef);

      if (orderSnap.exists()) {
        setOrder(orderSnap.data());
      } else {
        toast.error("Order not found!");
      }
      setLoading(false);
    };
    fetchOrder();
  }, [orderId, toast]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!order) return <p className="text-center mt-10">No order details available.</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Order Details</h2>

      <p className="text-sm text-gray-500 mb-2">Order ID: {orderId}</p>
      <p className="text-sm text-gray-500 mb-2">
        Date: {new Date(order.timestamp).toLocaleString()}
      </p>

      <h3 className="text-lg font-semibold mt-4 mb-2">Items:</h3>
      <ul className="divide-y">
        {order.items?.map((item, index) => (
          <li key={index} className="py-2 flex justify-between">
            <span>{item.name}</span>
            <span className="font-semibold">₹{item.price}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4 font-bold text-lg">
        Total: ₹{order.totalAmount || 0}
      </div>

      <Link
        to="/profile"
        className="inline-block mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        ← Back to Orders
      </Link>
    </div>
  );
}
