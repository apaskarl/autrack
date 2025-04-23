import { create } from "zustand";
import { collection, query, where, getDocs } from "firebase/firestore";
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
}

interface InstructorStore {
  instructors: Instructor[];
  fetchInstructors: () => Promise<void>;
}

export const useInstructorStore = create<InstructorStore>((set) => ({
  instructors: [],
  fetchInstructors: async () => {
    try {
      const usersRef = collection(db, "users");
      const deptRef = collection(db, "departments");

      // Fetch instructors
      const q = query(usersRef, where("role", "==", "instructor"));
      const userSnap = await getDocs(q);

      // Fetch departments
      const deptSnap = await getDocs(deptRef);
      const departments = deptSnap.docs.reduce((acc, doc) => {
        acc[doc.id] = doc.data().departmentName;
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
    }
  },
}));
