// src/components/Deals.jsx
import React from "react";

const deals = [
  { title: "Up to 60% off | Footwear", image: "https://images.unsplash.com/photo-1519741499884-5f9f0a6f8e8a?w=800&q=60&auto=format&fit=crop" },
  { title: "Up to 75% off | Headphones", image: "https://images.unsplash.com/photo-1585386959984-a415522f9f66?w=800&q=60&auto=format&fit=crop" },
  { title: "Get wholesale prices", image: "https://images.unsplash.com/photo-1581091870622-3d8ab1f8b0f8?w=800&q=60&auto=format&fit=crop" },
];

export default function Deals() {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <h2 className="text-2xl font-semibold mb-4">Deals & Offers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {deals.map((d, i) => (
            <div key={i} className="rounded-lg overflow-hidden border border-zinc-100 shadow-sm">
              <img src={d.image} alt={d.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <div className="font-semibold text-zinc-900">{d.title}</div>
                <p className="text-sm text-zinc-500 mt-2">Limited time deals — grab now.</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
