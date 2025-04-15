import { create } from "zustand";
import { auth, db } from "@/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { router } from "expo-router";
import { Alert } from "react-native";

type User = {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
};

type UserStore = {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  logout: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
};

const useUserStore = create<UserStore>((set) => ({
  user: null,

  setUser: (user) => set({ user }),

  clearUser: () => set({ user: null }),

  logout: async () => {
    try {
      await signOut(auth);
      set({ user: null });
      router.replace("/auth/login");
    } catch (error) {
      console.error("Logout Error:", error);
      throw error;
    }
  },

  login: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        set({
          user: {
            uid: user.uid,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
          },
        });

        router.replace("/instructor/home");
      } else {
        Alert.alert("Login Failed", "User data not found in Firestore.");
      }
    } catch (error: any) {
      Alert.alert("Login Failed", error.message);
      throw error;
    }
  },
}));

export default useUserStore;
