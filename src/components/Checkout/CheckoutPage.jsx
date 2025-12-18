// src/components/Checkout/CheckoutPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../Cart/CartContext";
import { db } from "../../config/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useToast } from '../../contexts/toastCore';
import { listAddresses } from '../../services/addressService';
import { listPaymentMethods } from '../../services/paymentService';

export default function CheckoutPage() {
  const { currentUser } = useAuth();
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState("review"); // review | payment | success
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  // If not authenticated, redirect to the full login page with redirect query
  React.useEffect(() => {
    if (!currentUser) {
      navigate(`/login?redirect=${encodeURIComponent("/checkout")}`);
    }
  }, [currentUser, navigate]);

  // load addresses and payment methods for selection
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      if (!currentUser) return;
      try {
        const a = await listAddresses(currentUser.uid);
        const p = await listPaymentMethods(currentUser.uid);
        if (mounted) {
          setAddresses(a || []);
          setPayments(p || []);
          if (a && a.length > 0 && !selectedAddress) setSelectedAddress(a[0].id);
          if (p && p.length > 0 && !selectedPayment) setSelectedPayment(p[0].id);
        }
      } catch (err) {
        console.error('Failed loading addresses or payments', err);
      }
    })();
    return () => { mounted = false; };
  }, [currentUser, selectedAddress, selectedPayment]);

  if (!currentUser) {
    // while navigate executes, render nothing (or a small loader)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600">Redirecting to login…</p>
      </div>
    );
  }

  // 💳 Step 2: Place order in Firestore
  const handleCompleteCheckout = async () => {
    if (cartItems.length === 0) {
      toast.info("Your cart is empty.");
      return;
    }

    if (!selectedAddress) { toast.info('Please select a delivery address'); setStep('review'); return; }
    if (!selectedPayment) { toast.info('Please select a payment method'); setStep('payment'); return; }

    try {
      setLoading(true);

      await addDoc(collection(db, "orders"), {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        userName: currentUser.displayName || "Guest",
        items: cartItems,
        total: cartItems.reduce((acc, item) => acc + item.price, 0),
        status: "Order Placed",
        deliveryAddressId: selectedAddress,
        paymentMethodId: selectedPayment,
        createdAt: serverTimestamp(),
      });

      clearCart();
      setStep("success");

      setTimeout(() => navigate("/profile"), 2500);
    } catch (error) {
      console.error("❌ Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      {step === "review" && (
        <div className="card-soft">
          <h1 className="text-3xl font-bold mb-6">Order Review</h1>
          {cartItems.length === 0 ? (
            <p className="text-gray-600">Your cart is empty.</p>
          ) : (
            <>
              <div className="mb-4">
                <h4 className="font-medium mb-2">Delivery address</h4>
                {addresses.length === 0 ? (
                  <div className="text-sm text-gray-500">No saved addresses. <a href="/profile" className="text-indigo-600 underline">Add one</a></div>
                ) : (
                  <div className="space-y-2">
                    {addresses.map(a => (
                      <label key={a.id} className="flex items-start gap-3 p-2 border rounded">
                        <input type="radio" name="address" checked={selectedAddress === a.id} onChange={() => setSelectedAddress(a.id)} />
                        <div>
                          <div className="font-medium">{a.label}</div>
                          <div className="text-sm text-gray-600">{a.line1}{a.line2 ? ', ' + a.line2 : ''}, {a.city} - {a.pincode}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              <ul className="divide-y divide-gray-200 mb-4">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex justify-between py-3 text-gray-700">
                    <span>{item.name}</span>
                    <span>₹{item.price}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between font-semibold text-lg border-t pt-4">
                <span>Total:</span>
                <span>₹{total}</span>
              </div>
              <button onClick={() => setStep("payment")} className="mt-6 btn-primary">Proceed to Payment</button>
            </>
          )}
        </div>
      )}

      {step === "payment" && (
        <div className="card-soft">
          <h2 className="text-2xl font-semibold mb-4">Payment</h2>
          <p className="text-gray-500 mb-4">(Simulated Payment — Add real integration later)</p>
          {payments.length === 0 ? (
            <div className="text-sm text-gray-500 mb-4">No saved payment methods. <a href="/profile" className="text-indigo-600 underline">Add one</a></div>
          ) : (
            <div className="space-y-2 mb-4">
              {payments.map(pm => (
                <label key={pm.id} className="flex items-center gap-3 border p-2 rounded">
                  <input type="radio" name="payment" checked={selectedPayment === pm.id} onChange={() => setSelectedPayment(pm.id)} />
                  <div>
                    <div className="font-medium">{pm.brand} • {pm.masked || (`**** **** **** ${pm.last4 || '0000'}`)}</div>
                    <div className="text-sm text-gray-500">{pm.cardholder}</div>
                  </div>
                </label>
              ))}
            </div>
          )}
          <button onClick={handleCompleteCheckout} disabled={loading} className={`w-full btn-primary ${loading ? 'opacity-60' : ''}`}>
            {loading ? "Processing..." : "Complete Payment"}
          </button>
        </div>
      )}

      {step === "success" && (
        <div className="card-soft text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-4">✅ Checkout Successful!</h2>
          <p className="text-gray-600 mb-2">Thank you for shopping, {currentUser.displayName || "Guest"}!</p>
          <p className="text-gray-500 text-sm">Redirecting to your profile...</p>
        </div>
      )}
    </div>
  );
}
