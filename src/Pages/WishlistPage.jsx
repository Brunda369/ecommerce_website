import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { listWishlist } from '../services/wishlistService';
import { Link } from 'react-router-dom';
import { useToast } from '../contexts/toastCore';

export default function WishlistPage() {
  const { currentUser } = useAuth();
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!currentUser) return;
      setLoading(true);
      try {
        const list = await listWishlist(currentUser.uid);
        if (mounted) setItems(list);
      } catch (err) {
        console.error('load wishlist', err);
        toast.error('Failed to load wishlist');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [currentUser, toast]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Your Wishlist</h1>
      {loading ? (
        <div className="text-gray-500">Loading…</div>
      ) : items.length === 0 ? (
        <div className="text-gray-500">You don't have any saved items yet.</div>
      ) : (
        <ul className="space-y-3">
          {items.map(i => (
            <li key={i.id} className="border rounded p-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{i.name || i.productId}</div>
                <div className="text-sm text-gray-600">₹{i.price}</div>
              </div>
              <div>
                <Link to={`/product/${i.productId}`} className="text-indigo-600 underline">View</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
