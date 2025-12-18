/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  updatePassword,
} from "firebase/auth";
import { db } from "../config/firebaseConfig";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { app } from "../config/firebaseConfig"; // ✅ Ensure firebaseConfig exports `app`

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(app);
  // Persist or update a minimal user record in Firestore
  const saveUserToFirestore = async (user) => {
    if (!user || !user.uid) return;
    try {
      const uref = doc(db, "users", user.uid);
      await setDoc(
        uref,
        {
          uid: user.uid,
          email: user.email || null,
          displayName: user.displayName || null,
          photoURL: user.photoURL || null,
          lastSeen: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (err) {
      console.error("❌ saveUserToFirestore error", err);
    }
  };

  const continueAsGuest = async () => {
  const cred = await signInAnonymously(auth);
  if (cred?.user) await saveUserToFirestore(cred.user);
};

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    if (cred?.user) await saveUserToFirestore(cred.user);
  };

  const register = async (email, password) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (cred?.user) await saveUserToFirestore(cred.user);
  };

  const loginWithEmail = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    if (cred?.user) await saveUserToFirestore(cred.user);
  };

  const logout = async () => {
    await signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      // keep a user document in Firestore for profile metadata
      if (user) saveUserToFirestore(user).catch((e) => console.warn('saveUserToFirestore failed', e));
      setLoading(false);
    });
    return unsubscribe;
  }, [auth]);

  const updateProfileData = async ({ displayName, photoURL }) => {
    if (!auth.currentUser) throw new Error("Not authenticated");
    // update Firebase Auth profile
    await updateProfile(auth.currentUser, { displayName, photoURL });
    // persist to Firestore
    await saveUserToFirestore(auth.currentUser);
    // refresh local state
    setCurrentUser({ ...auth.currentUser });
  };

  const changePassword = async (newPassword) => {
    if (!auth.currentUser) throw new Error("Not authenticated");
    await updatePassword(auth.currentUser, newPassword);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loginWithGoogle,
        continueAsGuest,
        register,
        // backward-compat alias used by some components
        registerWithEmail: register,
        loginWithEmail,
        logout,
        updateProfileData,
        changePassword,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
