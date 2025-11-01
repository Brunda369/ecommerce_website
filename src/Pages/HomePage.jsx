import React, { useState } from "react";
import CategoryBar from "../components/Layout/CategoryBar";
import ProductCard from "../components/Products/ProductCard";
import { useSearch } from "../contexts/SearchContext";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { searchQuery } = useSearch();

  // ✅ Dummy Product Data
  const products = [
    { id: 1, name: "Wireless Earbuds", category: "Electronics", price: 1499, image: "/images/earbuds.jpg" },
    { id: 2, name: "Sports Shoes", category: "Fashion", price: 2499, image: "/images/shoes.jpg" },
    { id: 3, name: "Fiction Novel", category: "Books", price: 499, image: "/images/book.jpg" },
    { id: 4, name: "Smart Watch", category: "Electronics", price: 3999, image: "/images/watch.jpg" },
  ];

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col items-center">
      <CategoryBar onSelectCategory={setSelectedCategory} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <p className="text-gray-500 mt-4">
          No products found in this category.
        </p>
      )}
    </div>
  );
}
