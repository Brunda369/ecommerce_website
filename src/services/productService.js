import { db } from '../config/firebaseConfig';
import { collection, query, getDocs, addDoc, doc, setDoc, deleteDoc, orderBy, serverTimestamp, updateDoc, getDoc } from 'firebase/firestore';

export async function listReviews(productId) {
  if (!productId) return [];
  const rref = collection(db, 'products', productId, 'reviews');
  const snap = await getDocs(query(rref, orderBy('createdAt', 'desc')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addReview(productId, payload) {
  const rref = collection(db, 'products', productId, 'reviews');
  const res = await addDoc(rref, { ...payload, createdAt: serverTimestamp() });
  return { id: res.id, ...payload };
}

export async function getLikes(productId) {
  if (!productId) return 0;
  const lref = collection(db, 'products', productId, 'likes');
  const snap = await getDocs(lref);
  return snap.size;
}

export async function userLiked(productId, uid) {
  if (!productId || !uid) return false;
  const dref = doc(db, 'products', productId, 'likes', uid);
  try {
    const s = await getDoc(dref);
    return s.exists();
  } catch {
    return false;
  }
}

export async function likeProduct(productId, uid) {
  if (!productId || !uid) return false;
  const dref = doc(db, 'products', productId, 'likes', uid);
  await setDoc(dref, { uid, createdAt: serverTimestamp() });
  return true;
}

export async function unlikeProduct(productId, uid) {
  if (!productId || !uid) return false;
  const dref = doc(db, 'products', productId, 'likes', uid);
  await deleteDoc(dref);
  return true;
}

export async function recomputeRating(productId) {
  // reads all reviews and updates product.rating
  if (!productId) return null;
  const reviews = await listReviews(productId);
  const avg = reviews.length ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length) : 0;
  const pref = doc(db, 'products', productId);
  try {
    await updateDoc(pref, { rating: Number(avg.toFixed(2)), ratingCount: reviews.length });
  } catch {
    // If the product doc doesn't exist, create/merge it so rating is stored
    const { setDoc } = await import('firebase/firestore');
    await setDoc(pref, { rating: Number(avg.toFixed(2)), ratingCount: reviews.length }, { merge: true });
  }
  return { avg, count: reviews.length };
}
