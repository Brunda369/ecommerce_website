import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "../Cart/CartContext";
import { db } from "../../config/firebaseConfig";
import { doc, onSnapshot, getDocs, collection, query, where } from "firebase/firestore";
import localProducts from '../../data/products';
import Product3DViewer from './Product3DViewer';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/toastCore';
import { listReviews, addReview, recomputeRating, getLikes } from '../../services/productService';
import { addToWishlist, removeFromWishlist, isInWishlist } from '../../services/wishlistService';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();
  const { currentUser } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewInput, setReviewInput] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    if (!id) return;
    const docId = String(id);
    let unsub;
    try {
      const dref = doc(db, "products", docId);
      unsub = onSnapshot(
        dref,
        (snap) => {
          try {
            if (!snap.exists()) {
              // If Firestore doc missing, try local bundled data first
              const local = localProducts.find(p => String(p.id) === String(id) || p.slug === id || String(p.name) === String(id));
              if (local) {
                setProduct({ id: String(local.id), ...local });
                return;
              }

              // If not found locally, try querying products collection for a matching 'id' or 'productId' field
              (async () => {
                try {
                  const col = collection(db, 'products');
                  // try numeric id field match
                  const maybeNum = Number(id);
                  if (!Number.isNaN(maybeNum)) {
                    const q1 = query(col, where('id', '==', maybeNum));
                    const s1 = await getDocs(q1);
                    if (!s1.empty) { setProduct({ id: s1.docs[0].id, ...s1.docs[0].data() }); return; }
                  }

                  // try productId string field
                  const q2 = query(col, where('productId', '==', String(id)));
                  const s2 = await getDocs(q2);
                  if (!s2.empty) { setProduct({ id: s2.docs[0].id, ...s2.docs[0].data() }); return; }

                  // not found anywhere
                  setProduct(null);
                } catch (err) {
                  console.error('Error querying products fallback', err);
                  setProduct(null);
                }
              })();
            } else {
              setProduct({ id: snap.id, ...snap.data() });
            }
          } catch (err) {
            console.error('Error handling product snapshot', err);
            // fallback to local
            const local = localProducts.find(p => String(p.id) === String(id) || p.slug === id || String(p.name) === String(id));
            if (local) setProduct({ id: String(local.id), ...local });
            else setProduct(null);
          }
        },
        (err) => {
            console.error('Product document onSnapshot error', err);
            try { toast && toast.error && toast.error('Failed to load product from Firestore — showing local data if available'); } catch (e) { console.warn('failed to show toast', e); }
            // fallback to local
          const local = localProducts.find(p => String(p.id) === String(id) || p.slug === id || String(p.name) === String(id));
          if (local) setProduct({ id: String(local.id), ...local });
          else setProduct(null);
        }
      );
    } catch (err) {
      console.error('Failed to subscribe to product doc', err);
      const local = localProducts.find(p => String(p.id) === String(id) || p.slug === id || String(p.name) === String(id));
      if (local) setProduct({ id: String(local.id), ...local });
      else setProduct(null);
    }

    return () => unsub && unsub();
  }, [id, toast]);

  useEffect(() => {
    if (!id) return;
    // load likes and reviews
    (async () => {
      try {
        const l = await getLikes(id);
        setLikes(l || 0);
      } catch (e) {
        console.warn('failed to load likes', e);
      }

      try {
        const r = await listReviews(id);
        setReviews(r || []);
      } catch (e) {
        console.warn('failed to load reviews', e);
      }
    })();
  }, [id]);

  // check whether current user has this product in wishlist (liked)
  useEffect(() => {
    if (!id) return;
    let mounted = true;
    (async () => {
      if (!currentUser) {
        if (mounted) setLiked(false);
        return;
      }
      try {
        const uLiked = await isInWishlist(currentUser.uid, id);
        if (mounted) setLiked(!!uLiked);
      } catch (err) {
        console.warn('failed to check wishlist status', err);
      }
    })();
    return () => { mounted = false; };
  }, [id, currentUser]);

  if (!product) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold">Product not found</h2>
        <Link to="/home" className="text-indigo-600 underline mt-3 block">
          Back to products
        </Link>
      </div>
    );
  }

  const image = product.thumbnail || (product.images && product.images[0]) || product.image;
  const model = product.modelUrl || product.model || null;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Product3DViewer modelUrl={model} poster={image || '/images/product-placeholder-2.svg'} />
        </div>

        <div className="md:col-span-2">
          <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
          <div className="mt-2 flex items-center gap-4">
            <div className="text-indigo-600 text-2xl font-semibold">₹{product.price}</div>
            <div className="text-sm text-gray-500">{product.rating} ★</div>
            <div className="text-sm text-gray-400">{product.category}</div>
          </div>

          <p className="mt-4 text-gray-700">{product.longDescription}</p>

          <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-sm mr-2">Qty</label>
              <input type="number" min={1} value={quantity} onChange={e=>setQuantity(Math.max(1, Number(e.target.value)||1))} className="w-20 border rounded px-2 py-1" />
            </div>

            <button
              onClick={() => { addToCart({ ...product, quantity }); toast.success('Added to cart'); }}
              className="btn-primary"
            >
              Add to Cart
            </button>

            <button onClick={() => { addToCart({ ...product, quantity }); navigate('/checkout'); }} className="bg-amber-600 text-white px-4 py-2 rounded">Buy now</button>

            <div className="ml-auto flex items-center gap-2">
              <button onClick={async () => {
                if (!currentUser) return toast.info('Please login to like products');
                try {
                  if (liked) {
                    await removeFromWishlist(currentUser.uid, product.id);
                    setLiked(false);
                    setLikes(l => Math.max(0, l-1));
                  } else {
                    await addToWishlist(currentUser.uid, product);
                    setLiked(true);
                    setLikes(l => l+1);
                  }
                } catch (e) { console.error(e); toast.error('Failed to update wishlist'); }
              }} className={`px-3 py-1 rounded ${liked ? 'bg-primary text-white' : 'border'}`}>
                {liked ? '♥ Saved' : '♡ Save'} • {likes}
              </button>
              

              <button onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: product.name, text: product.shortDescription || product.name, url: window.location.href });
                } else {
                  navigator.clipboard?.writeText(window.location.href); toast.info('Product link copied');
                }
              }} className="px-3 py-1 border rounded">Share</button>
            </div>

            <Link to="/home" className="text-gray-600 underline">
              ← Continue shopping
            </Link>
          </div>

          {/* Vendor info */}
          {product.vendor && (
            <div className="mt-4 border-t pt-3 text-sm">
              <div className="font-semibold">Sold by: {product.vendor.name || product.vendor}</div>
              {product.vendor.location && <div className="text-gray-500">{product.vendor.location}</div>}
              {product.vendor.contact && <div className="text-gray-500">Contact: {product.vendor.contact}</div>}
            </div>
          )}

          {/* Reviews */}
          <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-semibold">Reviews ({reviews.length})</h3>
            <ul className="space-y-3 mt-3">
              {reviews.map(r => (
                <li key={r.id} className="border rounded p-3">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{r.userName || r.uid || 'Customer'}</div>
                    <div className="text-sm text-yellow-600">{r.rating} ★</div>
                  </div>
                  <div className="text-sm text-gray-600 mt-2">{r.comment}</div>
                </li>
              ))}
            </ul>

            <div className="mt-4">
              <h4 className="font-medium">Write a review</h4>
              <div className="mt-2 flex items-center gap-2">
                <select value={reviewInput.rating} onChange={e=>setReviewInput({...reviewInput, rating: Number(e.target.value)})} className="border rounded px-2 py-1">
                  {[5,4,3,2,1].map(v=> <option key={v} value={v}>{v} ★</option>)}
                </select>
                <textarea value={reviewInput.comment} onChange={e=>setReviewInput({...reviewInput, comment: e.target.value})} className="flex-1 border rounded p-2" placeholder="Share your experience" />
              </div>
              <div className="mt-2 flex gap-2">
                <button onClick={async () => {
                  if (!currentUser) return toast.info('Please login to post reviews');
                  if (!reviewInput.comment.trim()) return toast.info('Please add a comment');
                  try {
                    await addReview(product.id, { uid: currentUser.uid, userName: currentUser.displayName || '', rating: reviewInput.rating, comment: reviewInput.comment });
                    const r = await listReviews(product.id);
                    setReviews(r);
                    await recomputeRating(product.id);
                    setReviewInput({ rating: 5, comment: '' });
                    toast.success('Review added');
                  } catch (e) { console.error(e); toast.error('Failed to add review'); }
                }} className="btn-primary">Submit review</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
