import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { signInAnonymously } from "firebase/auth";
import {
  loginWithGoogle as svcLoginWithGoogle,
  loginWithEmail as svcLoginWithEmail,
  registerWithEmail as svcRegisterWithEmail,
  logout as svcLogout,
  onAuthStateChangedListener as svcOnAuthStateChangedListener
} from "./authService.js";
import { auth } from "../config/firebaseConfig.js";

const AuthContext = createContext(null);

/**
 * AuthProvider
 * - provides: user, isGuest, showLoginModal
 * - functions: loginWithGoogle, loginWithEmail, registerWithEmail, logout, continueAsGuest
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load guest flag from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("isGuest");
      if (stored === "true") {
        setIsGuest(true);
      }
    } catch {
      // ignore
    }
  }, []);

  // Listen to Firebase auth state changes (subscribe once)
  useEffect(() => {
    setLoading(true);
    const unsubscribe = svcOnAuthStateChangedListener((u) => {
      setUser(u || null);

      // if firebase user is anonymous, mark guest
      if (u && u.isAnonymous) {
        setIsGuest(true);
        try { localStorage.setItem("isGuest", "true"); } catch {
          // ignore error
        }
      } else {
        // if a real user logged in, clear guest flag
        setIsGuest(false);
        try { localStorage.removeItem("isGuest"); } catch {
          // intentionally ignore error
        }
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // open / close modal helpers
  const openLoginModal = useCallback(() => setShowLoginModal(true), []);
  const closeLoginModal = useCallback(() => setShowLoginModal(false), []);

  // Google Login (uses service)
  const loginWithGoogle = useCallback(async () => {
    try {
      const res = await svcLoginWithGoogle();
      setUser(res.user);
      setIsGuest(false);
      try { localStorage.removeItem("isGuest"); } catch {
        // intentionally ignore error
      }
      closeLoginModal();
      return res;
    } catch (err) {
      console.error("loginWithGoogle error:", err);
      throw err;
    }
  }, [closeLoginModal]);

  // Email / Password login
  const loginWithEmail = useCallback(async (email, password) => {
    try {
      const res = await svcLoginWithEmail(email, password);
      setUser(res.user);
      setIsGuest(false);
      try { localStorage.removeItem("isGuest"); } catch {
        // intentionally ignore error
      }
      closeLoginModal();
      return res;
    } catch (err) {
      console.error("loginWithEmail error:", err);
      throw err;
    }
  }, [closeLoginModal]);

  // Email / Password register
  const registerWithEmail = useCallback(async (email, password) => {
    try {
      const res = await svcRegisterWithEmail(email, password);
      setUser(res.user);
      setIsGuest(false);
      try { localStorage.removeItem("isGuest"); } catch  { /* intentionally ignore error */ }
      closeLoginModal();
      return res;
    } catch (err) {
      console.error("registerWithEmail error:", err);
      throw err;
    }
  }, [closeLoginModal]);

  // Logout
  const logout = useCallback(async () => {
    try {
      await svcLogout();
      setUser(null);
      setIsGuest(false);
      try { localStorage.removeItem("isGuest"); } catch { /* intentionally ignore error */ }
    } catch (err) {
      console.error("logout error:", err);
      throw err;
    }
  }, []);

  // Continue as Guest (anonymous sign-in)
  const continueAsGuest = useCallback(async () => {
    // if already authenticated as any user, do nothing
    if (user) return { alreadySignedIn: true };

    try {
      // create anonymous firebase auth session
      const result = await signInAnonymously(auth);
      setUser(result.user);
      setIsGuest(true);
      try { localStorage.setItem("isGuest", "true"); } catch { /* intentionally ignore error */ }
      closeLoginModal();
      return result;
    } catch (err) {
      console.error("continueAsGuest error:", err);
      throw err;
    }
  }, [user, closeLoginModal]);

  const value = {
    user,
    isGuest,
    loading,
    showLoginModal,
    openLoginModal,
    closeLoginModal,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    logout,
    continueAsGuest,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook for convenience
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
