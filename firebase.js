import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyBQVVAemAOHGtMGJKDyndyc4kAoTjGaSRA",
  authDomain: "autrack-49528.firebaseapp.com",
  projectId: "autrack-49528",
  storageBucket: "autrack-49528.firebasestorage.app",
  messagingSenderId: "33065646832",
  appId: "1:33065646832:web:8a4a55fe3712c952b8a035",
};

const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { auth };
export const db = getFirestore(app);
