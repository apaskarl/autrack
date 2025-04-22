import { create } from "zustand";
import { collection, getDocs, addDoc, doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";

type Schedule = {
  id: string;
  day: string;
  start_time: string;
  end_time: string;
  instructor_id: string;
  instructor_name: string;
};

type Room = {
  id: string;
  room_name: string;
  is_available: boolean;
  current_occupant: string | null;
  building: string;
};

type RoomStore = {
  rooms: Room[];
  currentRoom: Room | null;
  loading: boolean;
  error: string | null;
  fetchRooms: () => Promise<void>;
  fetchRoom: (id: string) => Promise<void>;
  addRoom: (room_name: string, building: string) => Promise<void>;
  clearCurrentRoom: () => void;
  schedules: Schedule[];
  addScheduleToRoom: (
    roomId: string,
    schedule: Omit<Schedule, "id">
  ) => Promise<void>;
  fetchSchedulesForRoom: (roomId: string) => Promise<void>;
};

const useRoomStore = create<RoomStore>((set, get) => ({
  rooms: [],
  currentRoom: null,
  loading: false,
  error: null,
  schedules: [],

  fetchRooms: async () => {
    try {
      set({ loading: true });
      const roomsRef = collection(db, "rooms");
      const querySnapshot = await getDocs(roomsRef);
      const roomList: Room[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Room[];

      set({ rooms: roomList, error: null });
    } catch (error) {
      set({ error: "Failed to fetch rooms" });
      console.error("Failed to fetch rooms:", error);
    } finally {
      set({ loading: false });
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

  addRoom: async (room_name, building) => {
    try {
      set({ loading: true });
      await addDoc(collection(db, "rooms"), {
        room_name,
        building,
        is_available: true,
        current_occupant: null,
      });
      await get().fetchRooms(); // refresh after adding
    } catch (error) {
      set({ error: "Failed to add room" });
      console.error("Failed to add room:", error);
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
}));

export default useRoomStore;
