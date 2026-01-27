// src/components/Layout/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-12 text-gray-200">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 items-start text-sm">
          <div>
            <div className="text-lg font-bold text-white">ShopCart</div>
            <p className="text-sm text-gray-400 mt-2">Quality products, delivered fast.</p>
          </div>

          <div>
            <div className="font-semibold text-white">Company</div>
            <ul className="text-sm text-gray-300 mt-2 space-y-1">
              <li>
                <Link to="/landing#about" className="hover:text-indigo-600">
                  About
                </Link>
              </li>
              <li>
                <Link to="/landing#features" className="hover:text-indigo-600">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/landing#contact" className="hover:text-indigo-600">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="font-semibold text-white">Support</div>
            <ul className="text-sm text-gray-300 mt-2 space-y-1">
              <li>
                <Link to="/landing#contact" className="hover:text-indigo-600">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/landing#contact" className="hover:text-indigo-600">
                  Returns
                </Link>
              </li>
              <li>
                <Link to="/landing#contact" className="hover:text-indigo-600">
                  Shipping
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="font-semibold text-white">Follow us</div>
            <div className="mt-3 text-sm text-gray-300 flex flex-col sm:flex-row sm:gap-3">Twitter • Instagram • Facebook</div>
          </div>
        </div>
        <div className="mt-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} ShopCart • Built with React & Tailwind
        </div>
      </div>
    </footer>
  );
}
