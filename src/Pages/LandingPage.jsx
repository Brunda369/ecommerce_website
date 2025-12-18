import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function LandingPage() {
  const { hash } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const scrollToHash = () => {
      if (hash) {
        const id = hash.replace("#", "");
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    // small delay to allow layout
    setTimeout(scrollToHash, 50);
    // also listen to hashchange
    const handler = () => scrollToHash();
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, [hash]);

  const enterShop = () => {
    try {
      localStorage.setItem("seenLanding", "true");
    } catch {
      // ignore
    }
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white">
      <section className="pt-20 pb-16 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">Welcome to ShopEase</h1>
            <p className="mt-4 text-lg text-gray-600">
              A simple, modern e-commerce demo. Browse curated products, add to cart,
              and checkout using Firebase-backed orders.
            </p>

            <div className="mt-6 flex gap-4">
              <button onClick={enterShop} className="bg-indigo-600 text-white px-5 py-3 rounded-md hover:bg-indigo-700">Enter Shop</button>

              <a href="#about" className="text-indigo-600 px-4 py-3 rounded-md border border-indigo-100 hover:bg-indigo-50">Learn more</a>
            </div>
          </div>

          <div className="order-first md:order-last">
            <div className="bg-gray-100 rounded-xl p-6">
              <img src="https://images.unsplash.com/photo-1611939591453-9d9b4f0b3e9e?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=5f1d3d6c2a8f9b7c6d5e4f3a2b1c0d9e" alt="Shop hero" className="w-full h-56 object-cover rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-semibold mb-4">About ShopEase</h2>
          <p className="text-gray-600">ShopEase is a minimal e-commerce demo built with React, Vite, Tailwind, and Firebase. It showcases product listings, cart flows, and order persistence using Firestore.</p>
        </div>
      </section>

      <section id="features" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-semibold mb-6">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="font-semibold">Easy Browsing</h3>
              <p className="text-gray-500 mt-2">Filter by category and search instantly.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="font-semibold">Secure Checkout</h3>
              <p className="text-gray-500 mt-2">Orders are saved to Firestore for your profile.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="font-semibold">Guest Checkout</h3>
              <p className="text-gray-500 mt-2">You can continue as guest with anonymous auth.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-semibold mb-4">Get in touch</h2>
          <p className="text-gray-600">For questions or feedback, open an issue or contact the maintainer.</p>
        </div>
      </section>
    </div>
  );
}
