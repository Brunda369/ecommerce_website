// src/services/authService.js
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../config/firebaseConfig";

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  return await signInWithPopup(auth, provider);
};

export const loginWithEmail = async (email, password) =>
  await signInWithEmailAndPassword(auth, email, password);

export const registerWithEmail = async (email, password) =>
  await createUserWithEmailAndPassword(auth, email, password);

export const logout = async () => await signOut(auth);

export const onAuthStateChangedListener = (cb) => {
  const unsubscribe = onAuthStateChanged(auth, cb);
  return unsubscribe;
};

export default {
  loginWithGoogle,
  loginWithEmail,
  registerWithEmail,
  logout,
  onAuthStateChangedListener,
};
