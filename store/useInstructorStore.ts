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
} from "firebase/firestore";
import { auth } from "@/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "@/firebase";

interface Instructor {
  id: string;
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
    firstName: string,
    lastName: string,
    employeeId: number,
    email: string,
    password: string,
    departmentId: string
  ) => Promise<void>;
  loading: boolean;
  error: string | null;
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
        firstName,
        lastName,
        employeeId,
        email,
        departmentId,
        photoURL:
          "https://res.cloudinary.com/dsbbcevcp/image/upload/v1744735512/user_itndrd.jpg",
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
}));
