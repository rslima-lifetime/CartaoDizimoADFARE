import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBM_mBEUSv7WXoHoWUEIto9Vga7PcrLdBs",
  authDomain: "dizimos-adfare.firebaseapp.com",
  projectId: "dizimos-adfare",
  storageBucket: "dizimos-adfare.firebasestorage.app",
  messagingSenderId: "315304280168",
  appId: "1:315304280168:web:b2071e7cfc74159977bbdd",
  measurementId: "G-M3EZBCYJZL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);
