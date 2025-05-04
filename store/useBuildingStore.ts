import { create } from "zustand";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

type Building = {
  id: string;
  name: string;
};

interface BuildingStore {
  buildings: Building[];
  fetchBuildings: () => Promise<void>;
}

const useBuildingStore = create<BuildingStore>((set) => ({
  buildings: [],
  fetchBuildings: async () => {
    try {
      const snapshot = await getDocs(collection(db, "buildings"));
      const buildingList: Building[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
      }));
      set({ buildings: buildingList });
    } catch (error) {
      console.error("Failed to fetch buildings", error);
    }
  },
}));

export default useBuildingStore;
