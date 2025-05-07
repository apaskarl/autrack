import { create } from "zustand";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
  serverTimestamp,
  deleteDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/firebase";

type Room = {
  id: string;
  name: string;
  code: string;
  capacity: number;
  image: string;
  buildingId: string;
  buildingName: string;
  departmentId: string;
  departmentName: string;
  isAvailable: boolean;
  createdAt?: Timestamp;
  facilities?: {
    airConditioned: boolean;
    blackboard: boolean;
    tv: boolean;
    wifi: boolean;
    projector: boolean;
  };
};

type SortOption =
  | "default"
  | "date_asc"
  | "date_desc"
  | "name_asc"
  | "name_desc";

type RoomStore = {
  rooms: Room[];
  currentRoom: Room | null;
  loading: boolean;
  error: string | null;
  fetchRooms: () => Promise<void>;
  fetchRoom: (id: string) => Promise<void>;
  addRoom: (
    name: string,
    imageURL: string,
    buildingId: string,
    departmentId: string,
    code: string,
    capacity: number,
    facilities: Room["facilities"],
  ) => Promise<void>;
  updateRoom: (
    id: string,
    data: {
      name: string;
      image: string;
      buildingId: string;
      departmentId: string;
      code: string;
      capacity: number;
      facilities: Room["facilities"];
    },
  ) => Promise<void>;
  deleteRoom: (id: string) => Promise<void>;

  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  getSortedRooms: () => Room[];

  departmentFilters: string[];
  setDepartmentFilters: (departmentIds: string[]) => void;
  getFilteredRooms: () => Room[];
};

const useRoomStore = create<RoomStore>((set, get) => ({
  rooms: [],
  currentRoom: null,
  loading: false,
  error: null,
  sortOption: "default",
  departmentFilters: [],

  fetchRooms: async () => {
    try {
      const snapshot = await getDocs(collection(db, "rooms"));

      const roomList: Room[] = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const roomData = docSnap.data() as Room;

          const [buildingDoc, departmentDoc] = await Promise.all([
            getDoc(doc(db, "buildings", roomData.buildingId)),
            getDoc(doc(db, "departments", roomData.departmentId)),
          ]);

          const buildingName = buildingDoc.exists()
            ? (buildingDoc.data().name ?? "")
            : "";
          const departmentName = departmentDoc.exists()
            ? (departmentDoc.data().name ?? "")
            : "";

          return {
            ...roomData,
            id: docSnap.id,
            buildingName,
            departmentName,
          };
        }),
      );

      set({ rooms: roomList, error: null });
    } catch (error) {
      set({ error: "Failed to fetch rooms" });
      console.error("Failed to fetch rooms:", error);
    }
  },

  fetchRoom: async (id) => {
    if (!id) return;
    try {
      set({ loading: true, error: null });
      const roomRef = doc(db, "rooms", id);
      const roomSnap = await getDoc(roomRef);

      if (roomSnap.exists()) {
        const data = roomSnap.data() as Omit<
          Room,
          "id" | "buildingName" | "departmentName"
        >;

        const [buildingDoc, departmentDoc] = await Promise.all([
          getDoc(doc(db, "buildings", data.buildingId)),
          getDoc(doc(db, "departments", data.departmentId)),
        ]);

        const buildingName = buildingDoc.exists()
          ? (buildingDoc.data().name ?? "")
          : "";
        const departmentName = departmentDoc.exists()
          ? (departmentDoc.data().name ?? "")
          : "";

        set({
          currentRoom: {
            id: roomSnap.id,
            ...data,
            buildingName,
            departmentName,
          },
          error: null,
        });
      } else {
        set({ currentRoom: null, error: "Room not found" });
      }
    } catch (error) {
      set({ error: "Error fetching room" });
      console.error("Error fetching room:", error);
    } finally {
      set({ loading: false });
    }
  },

  addRoom: async (
    name,
    image,
    buildingId,
    departmentId,
    code,
    capacity,
    facilities,
  ) => {
    try {
      set({ loading: true });
      await addDoc(collection(db, "rooms"), {
        name,
        code,
        capacity,
        image,
        buildingId,
        departmentId,
        facilities,
        isAvailable: true,
        createdAt: serverTimestamp(),
      });
      await get().fetchRooms();
    } catch (error) {
      set({ error: "Failed to add room" });
      console.error("Failed to add room:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteRoom: async (id: string) => {
    try {
      set({ loading: true });
      await deleteDoc(doc(db, "rooms", id));
      await get().fetchRooms();
    } catch (error) {
      console.error("Failed to delete room:", error);
      set({ error: "Failed to delete room" });
    } finally {
      set({ loading: false });
    }
  },

  updateRoom: async (
    id: string,
    data: {
      name: string;
      image: string;
      buildingId: string;
      departmentId: string;
      code: string;
      capacity: number;
      facilities: Room["facilities"];
    },
  ) => {
    try {
      set({ loading: true });
      const roomRef = doc(db, "rooms", id);
      await updateDoc(roomRef, data);
      await get().fetchRooms();
      await get().fetchRoom(id);
    } catch (error) {
      console.error("Failed to update room:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  setSortOption: (option: SortOption) => {
    set({ sortOption: option });
  },

  getSortedRooms: () => {
    const { rooms, sortOption, departmentFilters } = get();
    let filteredRooms = [...rooms];

    if (departmentFilters.length > 0) {
      filteredRooms = filteredRooms.filter((room) =>
        departmentFilters.includes(room.departmentId),
      );
    }

    switch (sortOption) {
      case "date_asc":
        filteredRooms = filteredRooms.sort(
          (a, b) =>
            (a.createdAt?.toDate().getTime() || 0) -
            (b.createdAt?.toDate().getTime() || 0),
        );
        break;
      case "date_desc":
        filteredRooms = filteredRooms.sort(
          (a, b) =>
            (b.createdAt?.toDate().getTime() || 0) -
            (a.createdAt?.toDate().getTime() || 0),
        );
        break;
      case "name_asc":
        filteredRooms = filteredRooms.sort((a, b) =>
          a.name.localeCompare(b.name),
        );
        break;
      case "name_desc":
        filteredRooms = filteredRooms.sort((a, b) =>
          b.name.localeCompare(a.name),
        );
        break;
      case "default":
      default:
        break;
    }

    return filteredRooms;
  },

  setDepartmentFilters: (departmentIds: string[]) => {
    set({ departmentFilters: departmentIds });
  },

  getFilteredRooms: () => {
    const { rooms, departmentFilters } = get();
    if (departmentFilters.length === 0) return rooms;
    return rooms.filter((room) =>
      departmentFilters.includes(room.departmentId),
    );
  },
}));

export default useRoomStore;
