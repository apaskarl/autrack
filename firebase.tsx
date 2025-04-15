import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBQVVAemAOHGtMGJKDyndyc4kAoTjGaSRA",
  authDomain: "autrack-49528.firebaseapp.com",
  projectId: "autrack-49528",
  storageBucket: "autrack-49528.firebasestorage.app",
  messagingSenderId: "33065646832",
  appId: "1:33065646832:web:8a4a55fe3712c952b8a035",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
