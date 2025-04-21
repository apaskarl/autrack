import { create } from "zustand";
import { collection, getDocs } from "firebase/firestore";
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
};

const useRoomStore = create<RoomStore>((set) => ({
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
}));

export default useRoomStore;
