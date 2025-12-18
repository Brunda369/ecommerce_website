import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../Cart/CartContext"; // ✅ make sure this path is correct
import { useAuth } from "../../contexts/AuthContext";
import { useSearch } from "../../contexts/SearchContext";
import DebugPanel from './DebugPanel';

export default function Header({ openLoginModal }) {
  const { cartCount } = useCart();
  const { currentUser } = useAuth();
  const { searchQuery, setSearchQuery } = useSearch();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      const redirect = e?.detail?.redirect;
      if (typeof openLoginModal === "function") openLoginModal(redirect);
    };
    window.addEventListener("open-login-modal", handler);
    return () => window.removeEventListener("open-login-modal", handler);
  }, [openLoginModal]);

  const handleSearch = (e) => {
    e?.preventDefault();
    navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <header className="bg-gradient-to-r from-primary to-secondary text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/home" className="text-2xl font-extrabold tracking-tight text-white">ShopEase</Link>
          <span className="hidden sm:inline text-sm text-white/80">Quality products, delivered fast.</span>
        </div>

        <form onSubmit={handleSearch} className="flex items-center w-full max-w-lg bg-white rounded overflow-hidden hidden md:flex">
          <input
            type="text"
            placeholder="Search products..."
            className="px-3 py-2 w-full focus:outline-none text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="px-4 py-2 bg-primary text-white">Search</button>
        </form>

        <div className="flex items-center gap-3">
          <button className="md:hidden p-2 bg-white/10 rounded" onClick={() => setMobileOpen(true)} aria-label="Open menu" aria-expanded={mobileOpen}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {currentUser ? (
            <Link to="/profile" className="hidden sm:inline text-sm bg-white/10 px-3 py-2 rounded">Hello, {currentUser.displayName?.split(" ")[0] || "User"}</Link>
          ) : (
            <button onClick={() => openLoginModal && openLoginModal()} className="bg-white text-primary px-3 py-2 rounded text-sm">Login</button>
          )}

          <Link to="/cart" className="relative inline-flex items-center" aria-label="View cart">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">{cartCount}</span>
            )}
          </Link>
        </div>
      </div>

      {/* compact search for small screens */}
      <div className="md:hidden px-4 pb-3">
        <form onSubmit={handleSearch} className="flex items-center bg-white rounded overflow-hidden">
          <input
            type="text"
            placeholder="Search products..."
            className="px-3 py-2 w-full focus:outline-none text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="px-3 py-2 bg-primary text-white">Search</button>
        </form>
      </div>

      {/* debug panel (dev only) */}
      <DebugPanel />

      {/* Mobile slide-out menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} aria-hidden="true"></div>
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white p-4 shadow-lg overflow-auto" role="menu" aria-label="Main menu">
            <button className="mb-4 text-sm text-gray-700" onClick={() => setMobileOpen(false)} aria-label="Close menu">Close</button>
            <nav className="flex flex-col gap-2">
              <Link to="/home" className="px-3 py-2 rounded hover:bg-gray-100" onClick={() => setMobileOpen(false)}>Home</Link>
              <Link to="/home" className="px-3 py-2 rounded hover:bg-gray-100" onClick={() => setMobileOpen(false)}>Shop</Link>
              <Link to="/cart" className="px-3 py-2 rounded hover:bg-gray-100" onClick={() => setMobileOpen(false)}>Cart</Link>
              <Link to="/profile" className="px-3 py-2 rounded hover:bg-gray-100" onClick={() => setMobileOpen(false)}>Profile</Link>
              <Link to="/landing#about" className="px-3 py-2 rounded hover:bg-gray-100" onClick={() => setMobileOpen(false)}>About</Link>
            </nav>
          </aside>
        </div>
      )}
    </header>
  );
}
