// src/components/Auth/LoginModal.jsx
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginModal({ onClose }) {
  const {
    loginWithGoogle,
    continueAsGuest,
    loginWithEmail,
    registerWithEmail,
  } = useAuth();

  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (isRegistering) {
        await registerWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
      onClose();
    } catch (err) {
      alert(err.message || "Auth failed");
    } finally {
      setBusy(false);
    }
  };

  const handleGoogleLogin = async () => {
    setBusy(true);
    try {
      await loginWithGoogle();
      onClose();
    } catch (err) {
      alert(err.message || "Google sign-in failed");
    } finally {
      setBusy(false);
    }
  };

  const handleGuestLogin = async () => {
    setBusy(true);
    try {
      await continueAsGuest();
      onClose();
    } catch (err) {
      alert(err.message || "Guest login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-96 text-center">
        <h2 className="text-2xl font-semibold mb-6">
          {isRegistering ? "Create Account" : "Welcome Back"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border w-full p-2 rounded-lg"
            required
            disabled={busy}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border w-full p-2 rounded-lg"
            required
            disabled={busy}
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white py-2 rounded-lg w-full hover:bg-indigo-700"
            disabled={busy}
          >
            {busy ? "Please wait..." : isRegistering ? "Register" : "Login"}
          </button>
        </form>

        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center border rounded-lg w-full py-2 mt-3 hover:bg-gray-100"
          disabled={busy}
        >
          <FcGoogle className="mr-2" /> Continue with Google
        </button>

        <button
          onClick={handleGuestLogin}
          className="w-full text-indigo-600 underline hover:text-indigo-800 mt-3"
          disabled={busy}
        >
          Continue as Guest
        </button>

        <p className="mt-4 text-sm text-gray-500">
          {isRegistering ? (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setIsRegistering(false)}
                className="text-indigo-600 underline hover:text-indigo-800"
                disabled={busy}
              >
                Login
              </button>
            </>
          ) : (
            <>
              New here?{" "}
              <button
                onClick={() => setIsRegistering(true)}
                className="text-indigo-600 underline hover:text-indigo-800"
                disabled={busy}
              >
                Register
              </button>
            </>
          )}
        </p>

        <button onClick={onClose} className="text-gray-500 mt-4" disabled={busy}>
          Close
        </button>
      </div>
    </div>
  );
}
