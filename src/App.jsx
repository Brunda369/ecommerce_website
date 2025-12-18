import React, { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import ProductDetail from "./components/Products/ProductDetail";
import CartPage from "./components/Cart/CartPage";
import CheckoutPage from "./components/Checkout/CheckoutPage";
import { CartProvider } from "./components/Cart/CartContext";
import { SearchProvider } from "./contexts/SearchContext";
import HomePage from "./Pages/HomePage";
import LandingPage from "./Pages/LandingPage";
import LoginModal from "./components/Auth/LoginModal";
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
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [redirectAfterLogin, setRedirectAfterLogin] = useState(null);
  const navigate = useNavigate();

  // openLoginModal can accept an optional redirect path
  const openLoginModal = (redirect) => {
    // default to current path if not provided
    const to = redirect ?? (typeof window !== "undefined" ? window.location.pathname : "/home");
    setRedirectAfterLogin(to);
    setShowLoginModal(true);
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
    setRedirectAfterLogin(null);
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    const to = redirectAfterLogin || "/home";
    setRedirectAfterLogin(null);
    // navigate after short delay to allow modal to close
    setTimeout(() => navigate(to), 50);
  };

  return (
    <CartProvider>
      <SearchProvider>
        <div className="flex flex-col min-h-screen">
          <Header openLoginModal={openLoginModal} />

          <main className="flex-1 mt-6">
            <div className="max-w-7xl mx-auto px-4">
            <Routes>
              <Route path="/" element={<LandingGate />} />
              <Route path="/landing" element={<LandingPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/order/:orderId" element={<OrderDetails />} />

              {/* other routes */}
            </Routes>
            </div>
          </main>
          <Footer />
          <MobileNav />
          {showLoginModal && (
            <LoginModal onClose={closeLoginModal} onSuccess={handleLoginSuccess} />
          )}
        </div>
      </SearchProvider>
    </CartProvider>
  );
}

