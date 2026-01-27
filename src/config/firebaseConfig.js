// ✅ src/config/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { initializeFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAoMothkG073aKh9UcayweBcxB3RiCLMPE", // Use your actual key
  authDomain: "vite-5ddbb.firebaseapp.com",
  projectId: "vite-5ddbb",
  storageBucket: "vite-5ddbb.firebasestorage.app",
  messagingSenderId: "600998818215",
  appId: "1:600998818215:web:665f7175caa27235b68682",
  // measurementId: "G-XXXXXXXXXX" // Optional
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// Optional: export other Firebase services too
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false,
});
export const auth = getAuth(app);
// If running locally with Firebase emulators, connect to them when env vars are set.
// In development, set VITE_USE_FIREBASE_EMULATOR=true and either set
// VITE_FIRESTORE_EMULATOR_HOST and VITE_FIRESTORE_EMULATOR_PORT or VITE_FIRESTORE_EMULATOR to host:port
try {
  const useEmulator = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true') || process.env.USE_FIREBASE_EMULATOR === 'true';
  if (useEmulator) {
    // Firestore emulator
    const hostPort = (import.meta.env && import.meta.env.VITE_FIRESTORE_EMULATOR) || process.env.FIRESTORE_EMULATOR_HOST;
    const host = (import.meta.env && import.meta.env.VITE_FIRESTORE_EMULATOR_HOST) || (hostPort ? hostPort.split(':')[0] : null) || 'localhost';
    const port = (import.meta.env && import.meta.env.VITE_FIRESTORE_EMULATOR_PORT) || (hostPort ? (hostPort.split(':')[1] || '8080') : process.env.FIRESTORE_EMULATOR_PORT) || '8080';
    if (host && port) {
      // Use connectFirestoreEmulator from the SDK
      connectFirestoreEmulator(db, host, Number(port));
      // Auth emulator (optional)
      const authUrl = (import.meta.env && import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_URL) || process.env.FIREBASE_AUTH_EMULATOR_URL;
      if (authUrl) {
        connectAuthEmulator(auth, authUrl, { disableWarnings: true });
      }
      console.info('Connected Firebase SDK to local emulators', { host, port, authUrl });
    }
  }
} catch (err) {
  // Non-fatal in production
  // eslint-disable-next-line no-console
  console.warn('Failed to connect to Firebase emulators', err);
}
export { app };