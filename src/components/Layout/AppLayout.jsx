import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import MobileNav from "./MobileNav";

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // navigate to login page with redirect (keeps API similar to previous openLoginModal)
  const openLoginModal = (redirect) => {
    const to = redirect ?? (typeof window !== "undefined" ? window.location.pathname : "/home");
    navigate(`/login?redirect=${encodeURIComponent(to)}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header openLoginModal={openLoginModal} />

      <main className="flex-1 mt-6">
        <div key={location.key} className="max-w-7xl mx-auto px-4 animate-fadeIn">
          <Outlet />
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
