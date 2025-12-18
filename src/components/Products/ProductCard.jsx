import React, { useState, useEffect } from "react";
import { useCart } from "../Cart/CartContext";
import { Link } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/toastCore';
import { addToWishlist, removeFromWishlist, isInWishlist } from '../../services/wishlistService';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { currentUser } = useAuth();
  const toast = useToast();
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!currentUser) return;
      try {
        const inList = await isInWishlist(currentUser.uid, product.id);
        if (mounted) setLiked(!!inList);
      } catch {
        // ignore
      }
    })();
    return () => { mounted = false; };
  }, [currentUser, product.id]);

  const image = product.thumbnail || (product.images && product.images[0]) || product.image || '/images/product-placeholder-1.svg';
  const pid = product.id ?? product.productId ?? product.slug ?? String(product.name);

  return (
    <div className="bg-white border rounded-lg overflow-hidden hover:shadow-2xl transition transform hover:-translate-y-1 card-soft animate-fadeIn">
      <Link to={`/product/${pid}`} className="block">
        <div className="w-full h-44 sm:h-48 md:h-56 bg-gray-100 relative overflow-hidden">
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover transform transition duration-500 hover:scale-105"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute left-3 top-3 bg-gradient-to-r from-secondary to-primary text-white text-xs px-3 py-1 rounded-full shadow-lg">{product.category}</div>
          <div className="absolute right-3 bottom-3 bg-white/80 text-primary font-semibold px-3 py-1 rounded">₹{product.price}</div>

          {/* small overlay icons: like and share */}
          <div className="absolute right-3 top-3 flex flex-col gap-2">
            <button
              onClick={async (e) => {
                e.preventDefault(); e.stopPropagation();
                if (!currentUser) return toast.info('Please log in to add to wishlist');
                try {
                  if (!liked) {
                    await addToWishlist(currentUser.uid, product);
                    setLiked(true);
                    toast.success('Added to wishlist');
                  } else {
                    await removeFromWishlist(currentUser.uid, product.id);
                    setLiked(false);
                    toast.success('Removed from wishlist');
                  }
                } catch (err) { console.error(err); toast.error('Wishlist update failed'); }
              }}
              title={liked ? 'Remove from wishlist' : 'Add to wishlist'}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${liked ? 'bg-primary text-white' : 'bg-white/80 border'}`}>
              {liked ? '♥' : '♡'}
            </button>

            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigator.clipboard?.writeText(window.location.origin + '/product/' + pid); toast.info('Product link copied'); }}
              title="Share"
              className="w-8 h-8 rounded-full flex items-center justify-center bg-white/80 border text-sm">
              ⤴
            </button>
          </div>
        </div>
      </Link>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h3>
        <p className="text-sm text-gray-500 mt-2 line-clamp-2">{product.description}</p>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="text-sm text-gray-600">{product.rating} ★</div>
            <div className="text-xs text-gray-400">Free delivery available</div>
          </div>

          <button
            onClick={() => addToCart(product)}
            className="btn-primary"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
