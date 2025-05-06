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

type User = {
  id: string;
  uid: string;
  employeeId: number;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
};

type UserStore = {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  logout: () => Promise<void>;
  login: (emailOrId: string, password: string) => Promise<void>;
};

const roleRoutes: Record<string, string> = {
  instructor: "/instructor/home",
  admin: "/admin/(tabs)/home",
};

const useUserStore = create<UserStore>((set) => ({
  user: null,

  setUser: (user) => set({ user }),

  clearUser: () => set({ user: null }),

  logout: async () => {
    try {
      await signOut(auth);
      set({ user: null });
      router.replace("/");
    } catch (error) {
      console.error("Logout Error:", error);
      throw error;
    }
  },

  login: async (emailOrId, password) => {
    try {
      let emailToUse = emailOrId;

      if (/^\d+$/.test(emailOrId)) {
        const usersRef = collection(db, "users");
        const q = query(
          usersRef,
          where("employeeId", "==", parseInt(emailOrId)),
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          throw new Error("No user found with this employee ID");
        }

        const userDoc = querySnapshot.docs[0];
        emailToUse = userDoc.data().email;
      }

      const userCredential = await signInWithEmailAndPassword(
        auth,
        emailToUse,
        password,
      );

      const user = userCredential.user;
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();

        const role = userData.role;
        const route = roleRoutes[role];

        if (!route) {
          throw new Error("No route defined for this role.");
        }

        set({
          user: {
            id: docSnap.id, // <-- Include document id here
            uid: user.uid,
            employeeId: userData.employeeId,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            image: userData.image,
          },
        });

        router.replace(
          route as typeof router.replace extends (
            path: infer P,
            ...args: any[]
          ) => any
            ? P
            : never,
        );
      } else {
        throw new Error("User data not found in Firestore.");
      }
    } catch (error: any) {
      throw error;
    }
  },
}));

export default useUserStore;
