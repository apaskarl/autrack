import { create } from "zustand";
import { auth, db } from "@/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import {
  doc,
  getDoc,
  query,
  collection,
  where,
  getDocs,
} from "firebase/firestore";
import { router } from "expo-router";
import { Alert } from "react-native";

type User = {
  uid: string;
  employeeId: number;
  firstName: string;
  lastName: string;
  email: string;
  photoURL: string;
};

type UserStore = {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  logout: () => Promise<void>;
  login: (emailOrId: string, password: string) => Promise<void>;
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

  login: async (emailOrId, password) => {
    try {
      let emailToUse = emailOrId;

      // Check if the input is numeric (likely an employeeId)
      if (/^\d+$/.test(emailOrId)) {
        // Query users collection for this employeeId
        const usersRef = collection(db, "users");
        const q = query(
          usersRef,
          where("employeeId", "==", parseInt(emailOrId))
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          throw new Error("No user found with this employee ID");
        }

        // Get the first matching user (assuming employeeId is unique)
        const userDoc = querySnapshot.docs[0];
        emailToUse = userDoc.data().email;
      }

      // Proceed with email authentication
      const userCredential = await signInWithEmailAndPassword(
        auth,
        emailToUse,
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
            employeeId: userData.employeeId,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            photoURL: userData.photoURL,
          },
        });

        router.replace("/instructor/home");
      } else {
        throw new Error("User data not found in Firestore.");
      }
    } catch (error: any) {
      throw error;
    }
  },
}));

export default useUserStore;
