import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from '../contexts/toastCore';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function LoginPage() {
  const { loginWithGoogle, continueAsGuest, loginWithEmail, registerWithEmail } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const query = useQuery();
  const redirect = query.get("redirect") || "/home";
  const toast = useToast();

  const onSuccessNavigate = () => {
    setBusy(false);
    navigate(redirect);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (isRegistering) {
        await registerWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
      onSuccessNavigate();
    } catch (err) {
      toast.error(err.message || "Auth failed");
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setBusy(true);
    try {
      await loginWithGoogle();
      onSuccessNavigate();
    } catch (err) {
      toast.error(err.message || "Google sign-in failed");
      setBusy(false);
    }
  };

  const handleGuest = async () => {
    setBusy(true);
    try {
      await continueAsGuest();
      onSuccessNavigate();
    } catch (err) {
      toast.error(err.message || "Guest login failed");
      setBusy(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-6 animate-fadeIn flex gap-6 items-center">
        <div className="hidden md:block w-1/3 p-4">
          <div className="w-full h-full bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <svg width="180" height="180" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-90">
              <path d="M3 7h18M6 3v4M18 3v4M5 11h14l-1 8H6l-1-8z" stroke="white" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <div className="w-full md:w-2/3">
        <h2 className="text-2xl font-semibold text-center mb-4">{isRegistering ? "Create an account" : "Sign in to your account"}</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-primary"
            required
            disabled={busy}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-primary"
            required
            disabled={busy}
          />
          <button type="submit" className="btn-primary w-full" disabled={busy}>
            {busy ? "Please wait..." : isRegistering ? "Register" : "Login"}
          </button>
        </form>

        <div className="mt-3 flex gap-2">
          <button onClick={handleGoogle} className="flex items-center justify-center border rounded-lg w-full py-2 hover:bg-gray-50" disabled={busy}>
            <FcGoogle className="mr-2" /> Continue with Google
          </button>
        </div>

        <button onClick={handleGuest} className="w-full text-primary underline hover:opacity-90 mt-3" disabled={busy}>
          Continue as Guest
        </button>

        <p className="mt-4 text-sm text-gray-500 text-center">
          {isRegistering ? (
            <>
              Already have an account?{' '}
              <button onClick={() => setIsRegistering(false)} className="text-primary underline">Login</button>
            </>
          ) : (
            <>
              New here?{' '}
              <button onClick={() => setIsRegistering(true)} className="text-primary underline">Create account</button>
            </>
          )}
        </p>
        </div>
      </div>
    </div>
  );
}
