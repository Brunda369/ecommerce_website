// ✅ src/config/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

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
export const db = getFirestore(app);
export const auth = getAuth(app);
export { app };