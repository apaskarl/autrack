import { auth } from "@/firebase";
import { router } from "expo-router";
import { signOut } from "firebase/auth";
import { create } from "zustand";

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
      router.dismissAll();
    } catch (error) {
      console.error("Logout Error:", error);
      throw error;
    }
  },
}));

export default useUserStore;
