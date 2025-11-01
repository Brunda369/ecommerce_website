// src/components/Hero.jsx
import React from "react";

export default function Hero() {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="mt-6 rounded-lg overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1542831371-d531d36971e6?w=1600&q=80&auto=format&fit=crop"
            alt="Hero banner"
            className="w-full h-64 object-cover rounded-lg shadow-sm"
          />
        </div>
      </div>
    </div>
  );
}
