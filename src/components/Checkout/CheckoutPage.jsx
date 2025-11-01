// src/components/Checkout/CheckoutPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../Cart/CartContext";

export default function CheckoutPage() {
  const { currentUser } = useAuth();
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState("review"); // review | payment | success

  // 🛑 Step 1: Block access if not logged in or guest
  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          Please log in to continue
        </h2>
        <p className="text-gray-500 mb-4">
          You must log in or continue as a guest to proceed to checkout.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
        >
          Go Back to Home
        </button>
      </div>
    );
  }

  // 🧾 Step 2: Calculate total
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  // 🛒 Step 3: Handle transitions
  const handleProceedToPayment = () => setStep("payment");
  const handleCompleteCheckout = () => {
    clearCart();
    setStep("success");
    setTimeout(() => navigate("/"), 2500);
  };

  // 🧭 Step 4: Render UI per step
  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      {step === "review" && (
        <>
          <h1 className="text-3xl font-bold mb-6">Order Review</h1>
          {cartItems.length === 0 ? (
            <p className="text-gray-600">Your cart is empty.</p>
          ) : (
            <>
              <ul className="divide-y divide-gray-200 mb-4">
                {cartItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between py-2 text-gray-700"
                  >
                    <span>{item.name}</span>
                    <span>₹{item.price}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between font-semibold text-lg border-t pt-4">
                <span>Total:</span>
                <span>₹{total}</span>
              </div>
              <button
                onClick={handleProceedToPayment}
                className="mt-6 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                Proceed to Payment
              </button>
            </>
          )}
        </>
      )}

      {step === "payment" && (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Payment</h2>
          <p className="text-gray-500 mb-6">
            (Simulated Payment — Add real integration later)
          </p>
          <button
            onClick={handleCompleteCheckout}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Complete Payment
          </button>
        </div>
      )}

      {step === "success" && (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-4">
            ✅ Checkout Successful!
          </h2>
          <p className="text-gray-600 mb-2">
            Thank you for shopping, {currentUser.displayName || "Guest"}!
          </p>
          <p className="text-gray-500 text-sm">
            Redirecting to homepage...
          </p>
        </div>
      )}
    </div>
  );
}
