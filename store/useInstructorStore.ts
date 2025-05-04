// @/store/useInstructorStore.ts
import { create } from "zustand";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
import { auth } from "@/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "@/firebase";

interface Instructor {
  id: string;
  image: string;
  firstName: string;
  lastName: string;
  employeeId: number;
  email: string;
  departmentId: string;
  departmentName?: string;
  photoURL?: string;
  role: string;
  createdAt: any;
}

interface InstructorStore {
  instructors: Instructor[];
  fetchInstructors: () => Promise<void>;
  addInstructor: (
    imageURL: string,
    firstName: string,
    lastName: string,
    employeeId: number,
    email: string,
    password: string,
    departmentId: string
  ) => Promise<void>;
  loading: boolean;
  error: string | null;
  updateInstructor: (
    id: string,
    updatedData: Partial<Omit<Instructor, "id" | "role" | "createdAt">>
  ) => Promise<void>;
  deleteInstructor: (id: string) => Promise<void>;
}

export const useInstructorStore = create<InstructorStore>((set, get) => ({
  instructors: [],
  loading: false,
  error: null,

  fetchInstructors: async () => {
    try {
      set({ loading: true, error: null });
      const usersRef = collection(db, "users");
      const deptRef = collection(db, "departments");

      // Fetch instructors
      const q = query(usersRef, where("role", "==", "instructor"));
      const userSnap = await getDocs(q);

      // Fetch departments
      const deptSnap = await getDocs(deptRef);
      const departments = deptSnap.docs.reduce((acc, doc) => {
        acc[doc.id] = doc.data().name;
        return acc;
      }, {} as Record<string, string>);

      // Combine and format instructor data
      const instructors = userSnap.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          departmentName: departments[data.departmentId] || "Unknown",
        } as Instructor;
      });

      set({ instructors });
    } catch (err) {
      console.error("Failed to fetch instructors:", err);
      set({ error: "Failed to fetch instructors" });
    } finally {
      set({ loading: false });
    }
  },

  addInstructor: async (
    image,
    firstName,
    lastName,
    employeeId,
    email,
    password,
    departmentId
  ) => {
    try {
      set({ loading: true, error: null });

      // Create auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Create user document
      const userData = {
        image,
        firstName,
        lastName,
        employeeId,
        email,
        departmentId,
        role: "instructor",
        createdAt: serverTimestamp(),
      };

      await setDoc(doc(db, "users", user.uid), userData);

      // Refresh the instructors list
      await get().fetchInstructors();
    } catch (error: any) {
      console.error("Failed to add instructor:", error);
      set({ error: error.message || "Failed to add instructor" });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateInstructor: async (
    id: string,
    updatedData: Partial<Omit<Instructor, "id" | "role" | "createdAt">>
  ) => {
    try {
      set({ loading: true, error: null });
      const userRef = doc(db, "users", id);
      await setDoc(userRef, updatedData, { merge: true });
      await get().fetchInstructors();
    } catch (error) {
      console.error("Failed to update instructor:", error);
      set({ error: "Failed to update instructor" });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteInstructor: async (id: string) => {
    try {
      set({ loading: true });
      await deleteDoc(doc(db, "users", id));
      await get().fetchInstructors();
    } catch (error) {
      console.error("Failed to delete room:", error);
      set({ error: "Failed to delete room" });
    } finally {
      set({ loading: false });
    }
  },
}));
