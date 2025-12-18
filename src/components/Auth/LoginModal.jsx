// src/components/Auth/LoginModal.jsx
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaUserPlus, FaSignInAlt } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from '../../contexts/toastCore';

export default function LoginModal({ onClose, onSuccess }) {
  const {
    loginWithGoogle,
    continueAsGuest,
    loginWithEmail,
    registerWithEmail,
  } = useAuth();

  const toast = useToast();

  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (isRegistering) {
        if (password !== confirm) throw new Error("Passwords do not match");
        await registerWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
      if (typeof onSuccess === "function") onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.message || "Auth failed");
    } finally {
      setBusy(false);
    }
  };

  const handleGoogleLogin = async () => {
    setBusy(true);
    try {
      await loginWithGoogle();
      if (typeof onSuccess === "function") onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.message || "Google sign-in failed");
    } finally {
      setBusy(false);
    }
  };

  const handleGuestLogin = async () => {
    setBusy(true);
    try {
      await continueAsGuest();
      if (typeof onSuccess === "function") onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.message || "Guest login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="card-soft w-full max-w-2xl text-left flex overflow-hidden animate-fadeIn">
        <div className="w-1/3 bg-gradient-to-br from-primary to-secondary text-white p-6 flex flex-col items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-28 w-28 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 7h14l-2-7M16 21a2 2 0 11-4 0" />
          </svg>
          <h3 className="text-xl font-bold">Welcome to ShopEase</h3>
          <p className="text-sm mt-2">Fast checkout, secure payments and personalized offers.</p>
        </div>

        <div className="w-2/3 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex space-x-2">
              <button
                onClick={() => setIsRegistering(false)}
                className={`px-4 py-2 rounded-md flex items-center gap-2 ${!isRegistering ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                <FaSignInAlt /> Login
              </button>
              <button
                onClick={() => setIsRegistering(true)}
                className={`px-4 py-2 rounded-md flex items-center gap-2 ${isRegistering ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                <FaUserPlus /> Register
              </button>
            </div>
            <button onClick={onClose} className="text-gray-500">Close</button>
          </div>

          <h2 className="text-2xl font-semibold mb-4">{isRegistering ? 'Create your account' : 'Sign in to your account'}</h2>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-primary transition"
              required
              disabled={busy}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-primary transition"
              required
              disabled={busy}
            />
            {isRegistering && (
              <input
                type="password"
                placeholder="Confirm password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-primary transition"
                required
                disabled={busy}
              />
            )}

            <button type="submit" className="btn-primary w-full" disabled={busy}>
              {busy ? 'Please wait...' : isRegistering ? 'Create account' : 'Sign in'}
            </button>
          </form>

          <div className="mt-4">
            <button
              onClick={handleGoogleLogin}
              className="flex items-center justify-center border rounded-lg w-full py-2 hover:bg-gray-50"
              disabled={busy}
            >
              <FcGoogle className="mr-2" /> Continue with Google
            </button>

            <button
              onClick={handleGuestLogin}
              className="w-full text-primary underline hover:opacity-90 mt-3"
              disabled={busy}
            >
              Continue as Guest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
