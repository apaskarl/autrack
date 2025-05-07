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
  Timestamp,
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
  createdAt: Timestamp;
}

type SortOption =
  | "default"
  | "date_asc"
  | "date_desc"
  | "name_asc"
  | "name_desc";

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
    departmentId: string,
  ) => Promise<void>;
  loading: boolean;
  error: string | null;
  updateInstructor: (
    id: string,
    updatedData: Partial<Omit<Instructor, "id" | "role" | "createdAt">>,
  ) => Promise<void>;
  deleteInstructor: (id: string) => Promise<void>;

  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  getSortedInstructors: () => Instructor[];

  departmentFilters: string[];
  setDepartmentFilters: (departmentIds: string[]) => void;
  getFilteredInstructor: () => Instructor[];
}

export const useInstructorStore = create<InstructorStore>((set, get) => ({
  instructors: [],
  loading: false,
  error: null,
  sortOption: "default",
  departmentFilters: [],

  fetchInstructors: async () => {
    try {
      const usersRef = collection(db, "users");
      const deptRef = collection(db, "departments");

      // Fetch instructors
      const q = query(usersRef, where("role", "==", "instructor"));
      const userSnap = await getDocs(q);

      // Fetch departments
      const deptSnap = await getDocs(deptRef);
      const departments = deptSnap.docs.reduce(
        (acc, doc) => {
          acc[doc.id] = doc.data().name;
          return acc;
        },
        {} as Record<string, string>,
      );

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
    }
  },

  addInstructor: async (
    image,
    firstName,
    lastName,
    employeeId,
    email,
    password,
    departmentId,
  ) => {
    try {
      set({ loading: true, error: null });

      // Create auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
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
    updatedData: Partial<Omit<Instructor, "id" | "role" | "createdAt">>,
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

  setSortOption: (option: SortOption) => {
    set({ sortOption: option });
  },

  getSortedInstructors: () => {
    const { instructors, sortOption, departmentFilters } = get();
    let filteredInstructors = [...instructors];

    if (departmentFilters.length > 0) {
      filteredInstructors = filteredInstructors.filter((room) =>
        departmentFilters.includes(room.departmentId),
      );
    }

    switch (sortOption) {
      case "date_asc":
        filteredInstructors = filteredInstructors.sort(
          (a, b) =>
            (a.createdAt?.toDate().getTime() || 0) -
            (b.createdAt?.toDate().getTime() || 0),
        );
        break;
      case "date_desc":
        filteredInstructors = filteredInstructors.sort(
          (a, b) =>
            (b.createdAt?.toDate().getTime() || 0) -
            (a.createdAt?.toDate().getTime() || 0),
        );
        break;
      case "name_asc":
        filteredInstructors = filteredInstructors.sort((a, b) =>
          a.firstName.localeCompare(b.firstName),
        );
        break;
      case "name_desc":
        filteredInstructors = filteredInstructors.sort((a, b) =>
          b.firstName.localeCompare(a.firstName),
        );
        break;
      case "default":
      default:
        break;
    }

    return filteredInstructors;
  },

  setDepartmentFilters: (departmentIds: string[]) => {
    set({ departmentFilters: departmentIds });
  },

  getFilteredInstructor: () => {
    const { instructors, departmentFilters } = get();
    if (departmentFilters.length === 0) return instructors;
    return instructors.filter((instructor) =>
      departmentFilters.includes(instructor.departmentId),
    );
  },
}));
