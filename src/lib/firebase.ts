// This file is deprecated and will be removed in a future update.
// Please use the Firebase instance from @/firebase/provider instead.
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDL8o2B4XT9F0jtVrUnIGsVnTCspot12XU",
  authDomain: "longevitybarpos.firebaseapp.com",
  projectId: "longevitybarpos",
  storageBucket: "longevitybarpos.firebasestorage.app",
  messagingSenderId: "963596430153",
  appId: "1:963596430153:web:7d405bfd5c379039540898",
  measurementId: "G-9PSK36BCR8"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };
