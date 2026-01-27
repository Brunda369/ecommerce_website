import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/Layout/AppLayout";
import ProductDetail from "./components/Products/ProductDetail";
import CartPage from "./components/Cart/CartPage";
import CheckoutPage from "./components/Checkout/CheckoutPage";
import { CartProvider } from "./components/Cart/CartContext";
import { SearchProvider } from "./contexts/SearchContext";
import HomePage from "./Pages/HomePage";
import LandingPage from "./Pages/LandingPage";
// Login now uses a dedicated page instead of a modal
import LoginPage from "./Pages/LoginPage";
import SearchPage from "./Pages/SearchPage";
import ProfilePage from "./components/User/ProfilePage";
import WishlistPage from "./Pages/WishlistPage";
import OrderDetails from "./components/Profile/OrderDetails";
import MobileNav from "./components/Layout/MobileNav";
import OrdersPage from "./Pages/OrdersPage";

// Gate that shows landing only if the user hasn't seen it yet
function LandingGate() {
  if (typeof window !== "undefined") {
    const seen = localStorage.getItem("seenLanding") === "true";
    return seen ? <Navigate to="/home" replace /> : <LandingPage />;
  }
  return <LandingPage />;
}

export default function App() {

  return (
    <CartProvider>
      <SearchProvider>
        <div className="flex flex-col min-h-screen">
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<LandingGate />} />
              <Route path="/landing" element={<LandingPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/order/:orderId" element={<OrderDetails />} />
            </Route>

            {/* standalone routes (no header/footer) */}
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </div>
      </SearchProvider>
    </CartProvider>
  );
}

