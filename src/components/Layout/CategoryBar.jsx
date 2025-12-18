import React from "react";

const categories = [
  { key: "All", emoji: "🛍️" },
  { key: "Electronics", emoji: "🔊" },
  { key: "Fashion", emoji: "👟" },
  { key: "Books", emoji: "📚" },
  { key: "Home", emoji: "🏠" },
];

export default function CategoryBar({ onSelectCategory = () => {} }) {
  return (
    <div className="overflow-x-auto no-scrollbar py-3 hero-gradient shadow-sm border-b">
      <div className="flex items-center gap-3 px-3 sm:px-6 max-w-7xl mx-auto">
        <div className="flex gap-3 snap-x px-1">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => onSelectCategory(c.key)}
              className="snap-start flex items-center gap-2 bg-white text-gray-800 px-3 py-2 rounded-full shadow-sm hover:scale-105 transform transition duration-200 animate-fadeIn text-sm whitespace-nowrap"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-base">{c.emoji}</div>
              <span className="font-medium">{c.key}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
