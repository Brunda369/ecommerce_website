import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../Cart/CartContext";
import { useSearch } from "../../contexts/SearchContext";
import DebugPanel from './DebugPanel';
import { FiUser, FiHeart, FiShoppingBag, FiSearch } from 'react-icons/fi';

export default function Header({ openLoginModal }) {
  const { cartCount } = useCart();
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
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left: logo */}
          <div className="flex items-center gap-4">
            <Link to="/home" className="flex items-center gap-2">
              <svg width="40" height="28" viewBox="0 0 40 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="block">
                <defs>
                  <linearGradient id="g1" x1="0" x2="1">
                    <stop offset="0" stopColor="#FF6B6B" />
                    <stop offset="1" stopColor="#FFD66B" />
                  </linearGradient>
                </defs>
                <rect width="40" height="28" rx="6" fill="url(#g1)" />
                <text x="50%" y="60%" dominantBaseline="middle" textAnchor="middle" fontFamily="Inter, Arial" fontWeight="700" fontSize="14" fill="#fff">M</text>
              </svg>
              <span className="hidden sm:inline text-lg font-semibold text-gray-800">ShopEase</span>
            </Link>
          </div>

          {/* Center: categories + search */}
          <div className="flex-1 px-6 hidden lg:flex items-center gap-6">
            <nav className="flex gap-6 text-sm font-medium text-gray-600">
              <Link to="/home?category=Men">MEN</Link>
              <Link to="/home?category=Women">WOMEN</Link>
              <Link to="/home?category=Kids">KIDS</Link>
              <Link to="/home?category=Home">HOME</Link>
              <Link to="/home?category=Beauty">BEAUTY</Link>
              <Link to="/home?category=Genz">GENZ</Link>
              <Link to="/home?category=Studio" className="text-primary">STUDIO <span className="ml-1 text-xs bg-red-100 text-red-600 px-1 rounded">NEW</span></Link>
            </nav>

            <form onSubmit={handleSearch} className="flex items-center ml-6 w-full max-w-lg bg-gray-100 rounded overflow-hidden">
              <input
                type="text"
                placeholder="Search for products, brands and more"
                className="px-4 py-2 w-full focus:outline-none text-sm bg-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="px-4 text-gray-500"><FiSearch /></button>
            </form>
          </div>

          {/* Right: icons */}
          <div className="flex items-center gap-3">
            <button className="md:hidden p-2 text-gray-600 rounded" onClick={() => setMobileOpen(true)} aria-label="Open menu" aria-expanded={mobileOpen}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <Link to="/profile" className="hidden sm:flex items-center gap-2 text-gray-700 hover:text-gray-900">
              <FiUser className="h-5 w-5" />
              <span className="text-xs">Profile</span>
            </Link>

            <Link to="/wishlist" className="hidden sm:flex items-center gap-2 text-gray-700 hover:text-gray-900">
              <FiHeart className="h-5 w-5" />
              <span className="text-xs">Wishlist</span>
            </Link>

            <Link to="/cart" className="relative flex items-center gap-2 text-gray-700 hover:text-gray-900">
              <FiShoppingBag className="h-5 w-5" />
              <span className="text-xs">Bag</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">{cartCount}</span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* compact search for small screens */}
      <div className="md:hidden px-4 pb-3">
        <form onSubmit={handleSearch} className="flex items-center bg-gray-100 rounded overflow-hidden">
          <input
            type="text"
            placeholder="Search for products, brands and more"
            className="px-3 py-2 w-full focus:outline-none text-sm bg-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="px-3 text-gray-500"><FiSearch /></button>
        </form>
      </div>

      {/* Category bar removed from header (rendered separately) */}

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
                <Link to="/wishlist" className="px-3 py-2 rounded hover:bg-gray-100" onClick={() => setMobileOpen(false)}>Wishlist</Link>
              <Link to="/profile" className="px-3 py-2 rounded hover:bg-gray-100" onClick={() => setMobileOpen(false)}>Profile</Link>
              <Link to="/landing#about" className="px-3 py-2 rounded hover:bg-gray-100" onClick={() => setMobileOpen(false)}>About</Link>
            </nav>
          </aside>
        </div>
      )}
    </header>
  );
}
