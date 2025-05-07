import { create } from "zustand";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

type Department = {
  id: string;
  name: string;
};

interface DepartmentStore {
  departments: Department[];
  fetchDepartments: () => Promise<void>;
}

const useDepartmentStore = create<DepartmentStore>((set) => ({
  departments: [],

  fetchDepartments: async () => {
    try {
      const snapshot = await getDocs(collection(db, "departments"));
      const departmentList: Department[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
      }));
      set({ departments: departmentList });
    } catch (error) {
      console.error("Failed to fetch departments", error);
    }
  },
}));

export default useDepartmentStore;
