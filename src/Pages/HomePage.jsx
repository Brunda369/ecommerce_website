import React, { useEffect, useState } from "react";
import CategoryBar from "../components/Layout/CategoryBar";
import ProductCard from "../components/Products/ProductCard";
import { useSearch } from "../contexts/SearchContext";
import { db } from "../config/firebaseConfig";
import { collection, query, onSnapshot } from "firebase/firestore";
import localProducts from "../data/products";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { searchQuery } = useSearch();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "products"));
    let unsub;
    try {
      unsub = onSnapshot(
        q,
        (snap) => {
          console.debug('Firestore products snapshot size:', snap.size);
          if (snap.size > 0) console.debug('Product doc ids:', snap.docs.slice(0, 5).map((d) => d.id));
          const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          // If Firestore returns no documents (empty shop), fall back to local sample data
          if (!list || list.length === 0) {
            setProducts(localProducts.map((p) => ({ id: p.id?.toString() ?? p.slug ?? String(p.name), ...p })));
          } else {
            setProducts(list);
          }
        },
        (err) => {
          console.error('Firestore products snapshot error', err);
          // fallback to local products on error (e.g., permission denied)
          setProducts(localProducts.map((p) => ({ id: p.id?.toString() ?? p.slug ?? String(p.name), ...p })));
        }
      );
    } catch (err) {
      console.error('Failed to subscribe to products collection', err);
      setProducts(localProducts.map((p) => ({ id: p.id?.toString() ?? p.slug ?? String(p.name), ...p })));
    }

    return () => unsub && unsub();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes((searchQuery || "").toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col items-center w-full">
      <CategoryBar onSelectCategory={setSelectedCategory} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6 w-full max-w-7xl px-4">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <p className="text-gray-500 mt-4">No products found in this category.</p>
      )}
    </div>
  );
}
