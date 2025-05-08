import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDrlcJPU6phLK8gz_BzoEchOOh74aIhiLk",
  authDomain: "autrack-d6d6c.firebaseapp.com",
  projectId: "autrack-d6d6c",
  storageBucket: "autrack-d6d6c.firebasestorage.app",
  messagingSenderId: "686993363524",
  appId: "1:686993363524:web:e703c01ca250f71e9de211",
};

const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { auth };
export const db = getFirestore(app);
