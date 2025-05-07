import { create } from "zustand";
import { collection, getDocs, addDoc, doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";

type Schedule = {
  id: string;
  day: number;
  startTime: string;
  endTime: string;
  instructorId: string;
  instructorName: string;
};

type ScheduleStore = {
  schedules: Schedule[];
  fetchSchedulesForRoom: (roomId: string) => Promise<void>;
  fetchSchedulesForRoomDirect: (roomId: string) => Promise<Schedule[]>;
  addScheduleToRoom: (
    roomId: string,
    schedule: Omit<Schedule, "id" | "instructorName">,
  ) => Promise<void>;
};

const useScheduleStore = create<ScheduleStore>((set, get) => ({
  schedules: [],

  fetchSchedulesForRoom: async (roomId) => {
    try {
      const snapshot = await getDocs(
        collection(db, "rooms", roomId, "schedules"),
      );
      const scheduleList: Schedule[] = [];

      for (const docSnap of snapshot.docs) {
        const scheduleData = docSnap.data();
        const instructorDoc = await getDoc(
          doc(db, "users", scheduleData.instructorId),
        );

        const instructorData = instructorDoc.data();
        const instructorName = `${instructorData?.firstName} ${instructorData?.lastName}`;

        scheduleList.push({
          id: docSnap.id,
          day: scheduleData.day,
          startTime: scheduleData.startTime,
          endTime: scheduleData.endTime,
          instructorId: scheduleData.instructorId,
          instructorName,
        });
      }

      set({ schedules: scheduleList });
    } catch (error) {
      console.error("Error fetching schedules:", error);
    }
  },

  fetchSchedulesForRoomDirect: async (roomId) => {
    try {
      const snapshot = await getDocs(
        collection(db, "rooms", roomId, "schedules"),
      );
      const scheduleList: Schedule[] = [];

      for (const docSnap of snapshot.docs) {
        const scheduleData = docSnap.data();
        const instructorDoc = await getDoc(
          doc(db, "users", scheduleData.instructorId),
        );

        const instructorData = instructorDoc.data();
        const instructorName = `${instructorData?.firstName} ${instructorData?.lastName}`;

        scheduleList.push({
          id: docSnap.id,
          day: scheduleData.day,
          startTime: scheduleData.startTime,
          endTime: scheduleData.endTime,
          instructorId: scheduleData.instructorId,
          instructorName,
        });
      }

      return scheduleList;
    } catch (error) {
      console.error("Error fetching schedules:", error);
      return [];
    }
  },

  addScheduleToRoom: async (roomId, schedule) => {
    try {
      const scheduleRef = collection(db, "rooms", roomId, "schedules");
      await addDoc(scheduleRef, schedule);
      await get().fetchSchedulesForRoom(roomId);
    } catch (error) {
      console.error("Failed to add schedule:", error);
    }
  },
}));

export default useScheduleStore;
