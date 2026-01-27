import { db } from '../config/firebaseConfig';
import { collection, query, getDocs, addDoc, doc, deleteDoc, where, orderBy, serverTimestamp } from 'firebase/firestore';

export async function listWishlist(uid) {
  if (!uid) return [];
  const pref = collection(db, 'users', uid, 'wishlist');
  const snap = await getDocs(query(pref, orderBy('addedAt', 'desc')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function isInWishlist(uid, productId) {
  if (!uid || !productId) return false;
  const pref = collection(db, 'users', uid, 'wishlist');
  const q = query(pref, where('productId', '==', String(productId)));
  const snap = await getDocs(q);
  return snap.size > 0;
}

export async function addToWishlist(uid, product) {
  if (!uid || !product) return null;
  const pref = collection(db, 'users', uid, 'wishlist');
  const payload = {
    productId: String(product.id ?? product.productId ?? ''),
    name: product.name || product.title || '',
    thumbnail: product.thumbnail || product.image || (product.images && product.images[0]) || '',
    price: product.price || 0,
    // Use server timestamp for canonical ordering, but also include a client-side timestamp
    addedAt: serverTimestamp(),
    addedAtClient: new Date().toISOString()
  };
  try {
    const res = await addDoc(pref, payload);
    return { id: res.id, ...payload };
  } catch (err) {
    console.error('addToWishlist failed', err, { uid, product });
    throw err;
  }
}

export async function removeFromWishlist(uid, productId) {
  if (!uid || !productId) return false;
  const pref = collection(db, 'users', uid, 'wishlist');
  const q = query(pref, where('productId', '==', String(productId)));
  const snap = await getDocs(q);
  if (snap.empty) return false;
  try {
    await Promise.all(snap.docs.map(d => deleteDoc(doc(db, 'users', uid, 'wishlist', d.id))));
    return true;
  } catch (err) {
    console.error('removeFromWishlist failed', err, { uid, productId });
    throw err;
  }
}
