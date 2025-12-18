import { db } from '../config/firebaseConfig';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';

export async function listPaymentMethods(uid) {
  if (!uid) return [];
  const pref = collection(db, 'users', uid, 'paymentMethods');
  const snap = await getDocs(query(pref, orderBy('createdAt', 'desc')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addPaymentMethod(uid, payload) {
  const pref = collection(db, 'users', uid, 'paymentMethods');
  const res = await addDoc(pref, { ...payload, createdAt: serverTimestamp() });
  return { id: res.id, ...payload };
}

export async function updatePaymentMethod(uid, id, payload) {
  const dref = doc(db, 'users', uid, 'paymentMethods', id);
  await updateDoc(dref, { ...payload });
  return true;
}

export async function deletePaymentMethod(uid, id) {
  const dref = doc(db, 'users', uid, 'paymentMethods', id);
  await deleteDoc(dref);
  return true;
}
