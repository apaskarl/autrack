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
} from "firebase/firestore";
import { db } from "@/firebase";

type Schedule = {
  id: string;
  day: number;
  startTime: string;
  endTime: string;
  instructorId: string;
  instructorName: string;
};

type Room = {
  id: string;
  name: string;
  code: string;
  capacity: number;
  image: string;
  buildingId: string;
  departmentId: string;
  isAvailable: boolean;
  facilities?: {
    airConditioned: boolean;
    blackboard: boolean;
    tv: boolean;
    wifi: boolean;
    projector: boolean;
  };
};

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
    facilities: Room["facilities"]
  ) => Promise<void>;

  deleteRoom: (id: string) => Promise<void>;
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
    }
  ) => Promise<void>;

  clearCurrentRoom: () => void;
  schedules: Schedule[];
  addScheduleToRoom: (
    roomId: string,
    schedule: Omit<Schedule, "id">
  ) => Promise<void>;
  fetchSchedulesForRoom: (roomId: string) => Promise<void>;
  fetchSchedulesForRoomDirect: (roomId: string) => Promise<Schedule[]>;
};

const useRoomStore = create<RoomStore>((set, get) => ({
  rooms: [],
  currentRoom: null,
  loading: false,
  error: null,
  schedules: [],

  fetchRooms: async () => {
    try {
      const snapshot = await getDocs(collection(db, "rooms"));
      const roomList: Room[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Room[];

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
        const data = roomSnap.data() as Omit<Room, "id">;
        set({ currentRoom: { id: roomSnap.id, ...data }, error: null });
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
    facilities
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
    }
  ) => {
    try {
      set({ loading: true });
      const roomRef = doc(db, "rooms", id);
      await updateDoc(roomRef, data);
      await get().fetchRooms();
    } catch (error) {
      console.error("Failed to update room:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  clearCurrentRoom: () => set({ currentRoom: null }),

  addScheduleToRoom: async (roomId, schedule) => {
    try {
      const scheduleRef = collection(db, "rooms", roomId, "schedules");
      await addDoc(scheduleRef, schedule);
      await get().fetchSchedulesForRoom(roomId);
    } catch (error) {
      console.error("Failed to add schedule:", error);
    }
  },

  fetchSchedulesForRoom: async (roomId) => {
    try {
      const q = collection(db, "rooms", roomId, "schedules");
      const querySnapshot = await getDocs(q);
      const scheduleList: Schedule[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Schedule[];

      set({ schedules: scheduleList });
    } catch (error) {
      console.error("Error fetching schedules:", error);
    }
  },

  fetchSchedulesForRoomDirect: async (roomId: string) => {
    try {
      const q = collection(db, "rooms", roomId, "schedules");
      const querySnapshot = await getDocs(q);
      const scheduleList: Schedule[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Schedule[];

      return scheduleList;
    } catch (error) {
      console.error("Error fetching schedules:", error);
      return [];
    }
  },
}));

export default useRoomStore;
