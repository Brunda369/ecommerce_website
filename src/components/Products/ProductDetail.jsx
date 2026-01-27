import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "../Cart/CartContext";
import { db } from "../../config/firebaseConfig";
import { doc, onSnapshot, getDocs, collection, query, where } from "firebase/firestore";
import localProducts from '../../data/products';
import Product3DViewer from './Product3DViewer';
import ProductCard from './ProductCard';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/toastCore';
import { listReviews, getLikes } from '../../services/productService';
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
    <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-white rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: large image gallery (spans 2/3) */}
        <div className="md:col-span-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded overflow-hidden flex items-center justify-center">
              {model ? (
                <Product3DViewer model={model} />
              ) : (
                <img src={image || '/images/product-placeholder-2.svg'} alt={product.name} className="w-full h-[360px] sm:h-[520px] md:h-[560px] object-contain" />
              )}
            </div>

            <div className="flex flex-col gap-3">
              {(product.images || []).slice(0,4).map((img, idx) => (
                <div key={idx} className="h-28 sm:h-40 bg-gray-50 rounded overflow-hidden flex items-center justify-center">
                  <img src={img} alt={`${product.name}-${idx}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Customer photos / gallery strip */}
          <div className="mt-6">
            <h4 className="text-sm font-semibold mb-2">Customer Photos</h4>
            <div className="flex gap-3 overflow-x-auto py-2">
              {(product.customerPhotos || []).slice(0,8).map((p, i) => (
                <img key={i} src={p} alt={`cust-${i}`} className="w-20 h-20 sm:w-28 sm:h-28 object-cover rounded shadow-sm" />
              ))}
            </div>
          </div>
        </div>

        {/* Right: details and actions (spans 1/3) */}
        <div className="md:col-span-1">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{product.name}</h1>
          <div className="mt-2 flex items-center gap-3">
            <div className="text-xl sm:text-2xl font-semibold text-indigo-600">₹{product.price}</div>
            <div className="text-sm text-gray-500">{product.rating || '—'} ★</div>
          </div>

          <p className="mt-3 text-gray-700 text-sm">{product.shortDescription || product.description}</p>

          <div className="mt-4 border rounded p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Delivery Options</div>
              <button className="text-sm text-pink-600">Change</button>
            </div>
            <div className="mt-3 text-sm text-gray-600">Get it by <strong>Wed, Jan 07</strong></div>
            <div className="mt-2 text-sm text-gray-600">Pay on delivery not available</div>
            <div className="mt-2 text-sm text-gray-600">Easy 7 days return & exchange available</div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <div className="flex items-center gap-2">
              <label className="text-sm">Qty</label>
              <input type="number" min={1} value={quantity} onChange={e=>setQuantity(Math.max(1, Number(e.target.value)||1))} className="w-20 border rounded px-2 py-1" />
            </div>

            <button onClick={() => { addToCart({ ...product, quantity }); toast.success('Added to cart'); }} className="btn-primary w-full sm:w-auto ml-0 sm:ml-2">Add to Cart</button>
            <button onClick={() => { addToCart({ ...product, quantity }); navigate('/checkout'); }} className="bg-amber-600 text-white px-4 py-2 rounded w-full sm:w-auto">Buy now</button>
          </div>

          <div className="mt-4 flex gap-2 items-center">
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

              <button onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.info('Product link copied'); }} className="px-3 py-1 border rounded">Share</button>
          </div>

          {/* Vendor info */}
          {product.vendor && (
            <div className="mt-4 border-t pt-3 text-sm">
              <div className="font-semibold">Sold by: {product.vendor.name || product.vendor}</div>
            </div>
          )}

          {/* Rating summary and reviews brief */}
          <div className="mt-6 border-t pt-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">{product.rating || '—'}</div>
                <div className="text-sm text-gray-500">{reviews.length} Verified Buyers</div>
              </div>
              <div className="text-sm text-pink-600 underline">View all {reviews.length} reviews</div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="text-sm">Fit <div className="h-2 bg-gray-200 rounded"><div className="h-2 bg-emerald-500 rounded" style={{width: '74%'}}></div></div> Just Right (74%)</div>
              <div className="text-sm">Length <div className="h-2 bg-gray-200 rounded"><div className="h-2 bg-emerald-500 rounded" style={{width: '63%'}}></div></div> Just Right (63%)</div>
              <div className="text-sm">Transparency <div className="h-2 bg-gray-200 rounded"><div className="h-2 bg-emerald-500 rounded" style={{width: '50%'}}></div></div> Low (50%)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar products carousel */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Similar Products</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 overflow-x-auto">
          {localProducts.slice(0,8).map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
