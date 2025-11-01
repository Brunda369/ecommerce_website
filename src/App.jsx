import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import CategoryBar from "./components/Layout/CategoryBar";
import ProductCard from "./components/Products/ProductCard";
import ProductDetail from "./components/Products/ProductDetail";
import CartPage from "./components/Cart/CartPage";
import CheckoutPage from "./components/Checkout/CheckoutPage";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./components/Cart/CartContext";
import { SearchProvider } from "./contexts/SearchContext";
import HomePage from "./Pages/HomePage";
import LoginModal from "./components/Auth/LoginModal";
import { useState } from "react";
import SearchPage from "./Pages/SearchPage";



export default function App() {
  const [showLoginModal, setShowLoginModal] = useState(false);

  const openLoginModal = () => setShowLoginModal(true);
  const closeLoginModal = () => setShowLoginModal(false);

  return (
    <AuthProvider>
      <CartProvider>
        <SearchProvider>
          <div className="flex flex-col min-h-screen">
            <Header openLoginModal={openLoginModal} />
            
            <main className="flex flex-wrap justify-center gap-6 mt-6 flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/search" element={<SearchPage />} />


                {/* other routes */}
              </Routes>
            </main>
            <Footer />
            {showLoginModal && <LoginModal onClose={closeLoginModal} />}
          </div>
        </SearchProvider>
      </CartProvider>
    </AuthProvider>
  );
}
