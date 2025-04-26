import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import useRoomStore from "@/store/useRoomStore";
import { Ionicons } from "@expo/vector-icons";
import Loader from "@/components/shared/ui/Loader";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const TIMES = Array.from({ length: 26 }, (_, i) => {
  const hour = Math.floor(i / 2) + 7;
  const minute = i % 2 === 0 ? "00" : "30";
  const formatHour = (h: number) => h.toString().padStart(2, "0");
  return `${formatHour(hour)}:${minute}`;
});

const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const InstructorSchedules = () => {
  const { id: instructorId } = useLocalSearchParams<{ id: string }>(); // now getting instructorId
  const { rooms, fetchRooms } = useRoomStore();
  const [loading, setLoading] = useState(true);
  const [instructorSchedules, setInstructorSchedules] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!instructorId) return;
      setLoading(true);

      // First, fetch all rooms
      await fetchRooms();

      // After fetching rooms, get the latest rooms from the store
      const updatedRooms = useRoomStore.getState().rooms;

      // Fetch schedules for each room
      const schedulesPromises = updatedRooms.map(async (room) => {
        const schedulesSnapshot = await useRoomStore
          .getState()
          .fetchSchedulesForRoomDirect(room.id);

        // Add roomName into each schedule
        return schedulesSnapshot
          .filter((schedule) => schedule.instructorId === instructorId)
          .map((schedule) => ({
            ...schedule,
            roomName: room.roomName,
          }));
      });

      const schedulesPerRoom = await Promise.all(schedulesPromises);
      const mergedSchedules = schedulesPerRoom.flat();

      setInstructorSchedules(mergedSchedules);
      setLoading(false);
    };

    fetchData();
  }, [instructorId]);

  if (loading) {
    return <Loader />;
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} className="bg-white">
      <View className="relative px-8 pb-6 py-2 gap-y-1">
        <View className="flex-row items-center gap-x-4">
          <Text className="font-inter-bold text-xl">Instructor Schedules</Text>
        </View>
        <Text className="font-inter">Instructor ID: {instructorId}</Text>
      </View>

      {/* Timeable */}
      <View className="flex-row">
        {/* Time Column */}
        <View className="bg-gray-200 border-r border-border">
          <View className="py-2 justify-center items-center px-5 border-b border-border">
            <Text className="text-subtext font-inter-semibold">Time</Text>
          </View>

          {TIMES.map((time) => (
            <View
              className="px-5 justify-center items-center border-b border-border"
              key={time}
              style={{ height: 30 }}
            >
              <Text className="font-inter-medium text-sm text-subtext">
                {time}
              </Text>
            </View>
          ))}
        </View>

        {/* Horizontal Scroll for Days and Schedules */}
        <ScrollView horizontal>
          <View className="flex-row">
            {DAYS.map((dayName, dayIndex) => (
              <View key={dayIndex}>
                {/* Day Header */}
                <View className="py-2 justify-center items-center px-10 bg-blue border-r border-b border-border">
                  <Text className="text-white font-inter-bold">{dayName}</Text>
                </View>

                {/* Time Slots */}
                {(() => {
                  const cells = [];
                  let skipCount = 0;

                  for (let i = 0; i < TIMES.length; i++) {
                    if (skipCount > 0) {
                      skipCount--;
                      continue;
                    }

                    const currentTime = TIMES[i];

                    const matchingSchedule = instructorSchedules.find(
                      (schedule) =>
                        schedule.day === dayIndex + 1 &&
                        schedule.startTime === currentTime
                    );

                    if (matchingSchedule) {
                      const scheduleStart = timeToMinutes(
                        matchingSchedule.startTime
                      );
                      const scheduleEnd = timeToMinutes(
                        matchingSchedule.endTime
                      );
                      const durationMinutes = scheduleEnd - scheduleStart;
                      const blockHeight = (durationMinutes / 30) * 30;

                      const rowsToSpan = durationMinutes / 30;
                      skipCount = rowsToSpan - 1;

                      cells.push(
                        <View
                          key={`${dayIndex}-${i}`}
                          className="w-40 bg-blue/10 border-l-4 border-b border-r border-r-border border-l-blue border-b-border justify-center items-center"
                          style={{
                            height: blockHeight,
                          }}
                        >
                          <Text className="mb-1 font-inter-semibold leading-relaxed text-center">
                            {matchingSchedule.roomName}
                          </Text>
                          <Text className="font-inter text-sm text-subtext">
                            {matchingSchedule.startTime} -{" "}
                            {matchingSchedule.endTime}
                          </Text>
                        </View>
                      );
                    } else {
                      cells.push(
                        <View
                          className="w-40 border-r border-b border-border"
                          key={`${dayIndex}-${i}`}
                          style={{ height: 30 }}
                        />
                      );
                    }
                  }

                  return cells;
                })()}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </ScrollView>
  );
};

export default InstructorSchedules;
