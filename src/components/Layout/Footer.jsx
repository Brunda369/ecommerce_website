// src/components/Layout/Footer.jsx
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-12">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="text-lg font-bold text-indigo-700">ShopCart</div>
            <p className="text-sm text-zinc-500 mt-2">Quality products, delivered fast.</p>
          </div>

          <div>
            <div className="font-semibold text-zinc-900">Company</div>
            <ul className="text-sm text-zinc-600 mt-2 space-y-1">
              <li>About</li>
              <li>Careers</li>
              <li>Press</li>
            </ul>
          </div>

          <div>
            <div className="font-semibold text-zinc-900">Support</div>
            <ul className="text-sm text-zinc-600 mt-2 space-y-1">
              <li>Help Center</li>
              <li>Returns</li>
              <li>Shipping</li>
            </ul>
          </div>

          <div>
            <div className="font-semibold text-zinc-900">Follow us</div>
            <div className="mt-3 text-sm text-zinc-600">Twitter • Instagram • Facebook</div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-zinc-500">
          © {new Date().getFullYear()} ShopCart • Built with React & Tailwind
        </div>
      </div>
    </footer>
  );
}
