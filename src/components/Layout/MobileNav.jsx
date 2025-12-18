import React from 'react';
import { Link } from 'react-router-dom';

export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md md:hidden z-40">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        <Link to="/home" className="flex flex-col items-center text-sm text-gray-700">
          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10l9-7 9 7v8a2 2 0 0 1-2 2h-4v-6H9v6H5a2 2 0 0 1-2-2v-8z"></path></svg>
          Home
        </Link>

        <Link to="/search" className="flex flex-col items-center text-sm text-gray-700">
          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          Search
        </Link>

        <Link to="/cart" className="flex flex-col items-center text-sm text-gray-700">
          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4"/></svg>
          Cart
        </Link>

        <Link to="/profile" className="flex flex-col items-center text-sm text-gray-700">
          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5.121 17.804A9 9 0 1112 21a9.002 9.002 0 01-6.879-3.196z"/></svg>
          Account
        </Link>
      </div>
    </nav>
  );
}
