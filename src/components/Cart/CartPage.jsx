// src/components/Cart/CartPage.jsx
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "./CartContext";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from '../../contexts/toastCore';
import { addToWishlist } from '../../services/wishlistService';

export default function CartPage() {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleCheckout = () => {
    // Require a legal (non-anonymous) login to proceed to purchase
    if (!currentUser || currentUser.isAnonymous) {
      toast.info("Please log in to continue checkout.");
      navigate(`/login?redirect=${encodeURIComponent("/checkout")}`);
      return;
    }
    navigate("/checkout");
  };

  const total = cartItems.reduce((sum, item) => sum + (Number(item.price) || 0) * (item.qty || 1), 0);
  const totalMRP = cartItems.reduce((sum, item) => sum + (Number(item.originalPrice || item.mrp || item.price) || 0) * (item.qty || 1), 0);
  const discount = Math.max(0, totalMRP - total);
  const platformFee = cartItems.length > 0 ? 23 : 0;
  const finalTotal = Math.max(0, total - 0 + platformFee);

  const fmt = (v) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);

  const handleMoveToWishlist = async (item) => {
    if (!currentUser) {
      toast.info('Please log in to save items to wishlist');
      navigate(`/login?redirect=${encodeURIComponent('/cart')}`);
      return;
    }
    try {
      await addToWishlist(currentUser.uid, item);
      removeFromCart(item.id);
      toast.success('Moved to wishlist');
    } catch (err) {
      console.error('Move to wishlist failed', err);
      toast.error('Wishlist update failed');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Bag</h1>

      {cartItems.length === 0 ? (
        <div className="card-soft text-center py-12">
          <p className="text-gray-600">Your bag is empty.</p>
          <button onClick={() => navigate('/home')} className="mt-4 btn-primary">Add items</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: items list */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-md shadow p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">{cartItems.length} ITEMS SELECTED</div>
                <div className="flex items-center gap-4 text-sm">
                  <button onClick={clearCart} className="text-red-600">Remove all</button>
                  <button onClick={() => navigate('/wishlist')} className="text-primary">Move all to wishlist</button>
                </div>
              </div>
            </div>

            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-md shadow p-4 flex flex-col sm:flex-row gap-4 items-start">
                <Link to={`/product/${item.id}`} className="flex-shrink-0">
                  <img src={item.thumbnail || item.image || '/images/product-placeholder-1.svg'} alt={item.name} className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded cursor-pointer" />
                </Link>
                <div className="flex-1 w-full">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                    <div className="w-full sm:pr-4">
                      <h3 className="font-medium text-gray-800 text-base sm:text-lg"><Link to={`/product/${item.id}`} className="hover:underline">{item.name}</Link></h3>
                      <div className="text-xs text-gray-500 mt-1">Sold by: {item.seller || 'Store'}</div>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                        <div className="px-2 py-1 border rounded bg-gray-50 text-xs">Size: {item.size || 'N/A'}</div>
                        <div className="px-2 py-1 border rounded text-xs">Qty: {item.qty || 1}</div>
                      </div>
                    </div>
                    <div className="mt-3 sm:mt-0 text-right">
                      <div className="font-semibold text-gray-800">{fmt(Number(item.price) || 0)}</div>
                      {item.originalPrice && <div className="text-sm text-gray-500 line-through">{fmt(Number(item.originalPrice) || 0)}</div>}
                    </div>
                  </div>

                  <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="text-sm text-gray-500">Delivery between 11 Jan - 13 Jan</div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                      <button onClick={() => removeFromCart(item.id)} className="text-sm text-gray-600 hover:text-red-600">Remove</button>
                      <button onClick={() => handleMoveToWishlist(item)} className="text-sm text-primary">Move to wishlist</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-white rounded-md shadow p-4">
              <button onClick={() => navigate('/wishlist')} className="flex items-center justify-between w-full text-left">
                <span className="text-sm">Add More From Wishlist</span>
                <span className="text-sm text-primary">›</span>
              </button>
            </div>
          </div>

          {/* Right: summary */}
          <aside className="lg:col-span-4">
            <div className="bg-white rounded-md shadow p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-500">Deliver to:</div>
                  <div className="font-medium">{currentUser?.displayName || 'Select address'}</div>
                  <div className="text-sm text-gray-500">{currentUser?.email || 'No address selected'}</div>
                </div>
                <button onClick={() => navigate('/profile')} className="text-sm border px-3 py-1 rounded">CHANGE ADDRESS</button>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-semibold mb-2">Available Offers</h4>
                <div className="text-sm text-gray-600">10% Instant Discount On selected bank cards</div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600"><span>Total MRP</span><span>{fmt(totalMRP)}</span></div>
                <div className="flex justify-between text-sm text-gray-600"><span>Discount on MRP</span><span className="text-green-600">-{fmt(discount)}</span></div>
                <div className="flex justify-between text-sm text-gray-600"><span>Coupon Discount</span><button className="text-primary text-sm">Apply Coupon</button></div>
                <div className="flex justify-between text-sm text-gray-600"><span>Platform Fee</span><span>{fmt(platformFee)}</span></div>
                <div className="flex justify-between text-lg font-semibold mt-2"><span>Total Amount</span><span>{fmt(finalTotal)}</span></div>
              </div>

              <div className="space-y-2">
                <button onClick={handleCheckout} className="w-full bg-pink-600 text-white py-3 rounded font-semibold">PLACE ORDER</button>
                <button onClick={() => navigate('/home')} className="w-full border py-2 rounded">Continue shopping</button>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
