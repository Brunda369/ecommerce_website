import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../Cart/CartContext"; // ✅ make sure this path is correct
import { useAuth } from "../../contexts/AuthContext";
import LoginModal from "../Auth/LoginModal";
import { useSearch } from "../../contexts/SearchContext";

export default function Header() {
  const { cartCount } = useCart();
  const { currentUser, logout } = useAuth();
  const { searchQuery, setSearchQuery } = useSearch();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  // ✅ Listen for global open-login-modal event (used in CheckoutPage)
  useEffect(() => {
    const openModal = () => setShowLoginModal(true);
    window.addEventListener("open-login-modal", openModal);
    return () => window.removeEventListener("open-login-modal", openModal);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?query=${searchQuery}`);
  };

  return (
    <header className="bg-white shadow-md p-4 flex items-center justify-between sticky top-0 z-50">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold text-blue-600">
        ShopEase
      </Link>

      {/* 🔍 Search Bar */}
      <form onSubmit={handleSearch} className="flex items-center w-1/2 max-w-md">
        <input
          type="text"
          placeholder="Search products..."
          className="border border-gray-300 rounded-l px-3 py-2 w-full focus:outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      {/* Auth + Cart */}
      <div className="flex items-center gap-6">
        {currentUser ? (
          <>
            <span className="text-gray-700">
              Hello, {currentUser.displayName || "User"}
            </span>
            <button
              onClick={logout}
              className="text-sm text-red-600 hover:underline"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => setShowLoginModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Login
          </button>
        )}

        {/* 🛒 Cart Icon with Count */}
        <Link to="/cart" className="relative flex items-center space-x-1">
          <span className="material-icons text-2xl"> 🛒cart</span>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
              {cartCount}
            </span>
          )}
        </Link>
      </div>

      {/* Login Modal */}
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
    </header>
  );
}
