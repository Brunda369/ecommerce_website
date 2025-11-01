import React from "react";

const categories = ["All", "Electronics", "Fashion", "Books"];

export default function CategoryBar({ onSelectCategory = () => {} }) {
  return (
    <div className="flex justify-center gap-4 bg-gray-100 py-3">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className="bg-white text-gray-800 px-4 py-2 rounded-lg shadow hover:bg-blue-500 hover:text-white transition"
        >
          {category}
        </button>
      ))}
    </div>
  );
}
