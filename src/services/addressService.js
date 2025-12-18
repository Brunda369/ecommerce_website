import { db } from '../config/firebaseConfig';
import { collection, query, orderBy, getDocs, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

export async function listAddresses(uid) {
  if (!uid) return [];
  const aref = collection(db, 'users', uid, 'addresses');
  const q = query(aref, orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function createAddress(uid, payload) {
  try {
    const aref = collection(db, 'users', uid, 'addresses');
    const res = await addDoc(aref, { ...payload, createdAt: serverTimestamp() });
    return { id: res.id, ...payload };
  } catch (err) {
    console.error('createAddress failed', err);
    throw err;
  }
}

export async function updateAddress(uid, id, payload) {
  try {
    const dref = doc(db, 'users', uid, 'addresses', id);
    await updateDoc(dref, { ...payload, updatedAt: serverTimestamp() });
    return { id, ...payload };
  } catch (err) {
    console.error('updateAddress failed', err);
    throw err;
  }
}

export async function deleteAddress(uid, id) {
  try {
    const dref = doc(db, 'users', uid, 'addresses', id);
    await deleteDoc(dref);
    return true;
  } catch (err) {
    console.error('deleteAddress failed', err);
    throw err;
  }
}
