import { create } from "zustand";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "@/firebase";

type Room = {
  id: string;
  room_name: string;
  is_available: boolean;
  current_occupant: string | null;
  building: string;
};

type RoomStore = {
  rooms: Room[];
  fetchRooms: () => Promise<void>;
  addRoom: (room_name: string, building: string) => Promise<void>;
};

const useRoomStore = create<RoomStore>((set, get) => ({
  rooms: [],
  fetchRooms: async () => {
    try {
      const roomsRef = collection(db, "rooms");
      const querySnapshot = await getDocs(roomsRef);
      const roomList: Room[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Room[];

      set({ rooms: roomList });
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
    }
  },
  addRoom: async (room_name, building) => {
    try {
      await addDoc(collection(db, "rooms"), {
        room_name,
        building,
        is_available: true,
        current_occupant: null,
      });
      await get().fetchRooms(); // refresh after adding
    } catch (error) {
      console.error("Failed to add room:", error);
      throw error;
    }
  },
}));

export default useRoomStore;
