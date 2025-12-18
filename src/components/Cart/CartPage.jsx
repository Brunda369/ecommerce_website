// src/components/Cart/CartPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from '../../contexts/toastCore';

export default function CartPage() {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleCheckout = () => {
    if (!currentUser) {
      toast.info("Please log in to continue checkout.");
      navigate("/login");
    } else {
      navigate("/checkout");
    }
  };

  const total = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cartItems.length === 0 ? (
        <div className="card-soft text-center py-10">
          <p className="text-gray-600">Your cart is empty.</p>
          <button onClick={() => navigate('/home')} className="mt-4 btn-primary">Browse products</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 card-soft">
            <ul className="divide-y">
              {cartItems.map((item, index) => (
                <li key={index} className="flex justify-between items-center py-4">
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">₹{item.price}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => removeFromCart(item.id)} className="text-red-600 hover:text-red-800">Remove</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <aside className="card-soft">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold">₹{total}</span>
              </div>

              <button onClick={clearCart} className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600">Clear Cart</button>
              <button onClick={handleCheckout} className="w-full btn-primary">Checkout</button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
