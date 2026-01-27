import { db } from '../config/firebaseConfig';
import {
  doc,
  getDoc,
  onSnapshot,
  collection,
  getDocs
} from 'firebase/firestore';

// Get user data once: profile doc, wishlist (subcollection), addresses (subcollection)
export async function getUserDataOnce(userId) {
  if (!userId) return null;
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    const profile = userSnap.exists() ? userSnap.data() : null;

    const wishlistCol = collection(db, 'users', userId, 'wishlist');
    const wishlistSnap = await getDocs(wishlistCol);
    const wishlist = wishlistSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    const addressesCol = collection(db, 'users', userId, 'addresses');
    const addressesSnap = await getDocs(addressesCol);
    const addresses = addressesSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    return { profile, wishlist, addresses };
  } catch (err) {
    console.error('getUserDataOnce failed', err);
    throw err;
  }
}

// Subscribe to user data in real-time. Returns an unsubscribe function.
export function subscribeToUserData(userId, callback) {
  if (!userId) {
    callback(null);
    return () => {};
  }

  const userRef = doc(db, 'users', userId);
  const wishlistCol = collection(db, 'users', userId, 'wishlist');
  const addressesCol = collection(db, 'users', userId, 'addresses');

  const unsubscribes = [];

  // Helper to assemble latest snapshots and invoke callback
  const state = { profile: null, wishlist: [], addresses: [] };

  const maybeNotify = () => {
    callback({ ...state });
  };

  unsubscribes.push(onSnapshot(userRef, (snap) => {
    state.profile = snap.exists() ? snap.data() : null;
    maybeNotify();
  }, (err) => { console.error('userRef onSnapshot error', err); }));

  unsubscribes.push(onSnapshot(wishlistCol, (snap) => {
    state.wishlist = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    maybeNotify();
  }, (err) => { console.error('wishlist onSnapshot error', err); }));

  unsubscribes.push(onSnapshot(addressesCol, (snap) => {
    state.addresses = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    maybeNotify();
  }, (err) => { console.error('addresses onSnapshot error', err); }));

  return () => unsubscribes.forEach(u => u());
}

export default {
  getUserDataOnce,
  subscribeToUserData
};
