// src/Pages/SearchPage.jsx
import React from "react";
import { useSearchParams } from "react-router-dom";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Search Results for: {query}</h2>
      {/* TODO: Add filtered product display logic here */}
    </div>
  );
}