import { View, Text, ScrollView, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import useRoomStore from "@/store/useRoomStore";
import { useInstructorStore } from "@/store/useInstructorStore";
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

const AdminInstructorDetails = () => {
  const { id: instructorId } = useLocalSearchParams<{ id: string }>();
  const { rooms, fetchRooms } = useRoomStore();
  const { instructors, fetchInstructors } = useInstructorStore();
  const [loading, setLoading] = useState(true);
  const [instructorSchedules, setInstructorSchedules] = useState<any[]>([]);
  const [currentInstructor, setCurrentInstructor] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!instructorId) return;
      setLoading(true);

      // Fetch instructors if not already loaded
      if (instructors.length === 0) {
        await fetchInstructors();
      }

      // Find the current instructor
      const instructor = instructors.find((inst) => inst.id === instructorId);
      setCurrentInstructor(instructor);

      // Fetch all rooms
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
            roomName: room.name,
          }));
      });

      const schedulesPerRoom = await Promise.all(schedulesPromises);
      const mergedSchedules = schedulesPerRoom.flat();

      setInstructorSchedules(mergedSchedules);
      setLoading(false);
    };

    fetchData();
  }, [instructorId, instructors]);

  if (loading || !currentInstructor) {
    return <Loader />;
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} className="bg-white">
      <View className="relative gap-y-1 px-8 py-2 pb-5">
        {/* Instructor Profile Header */}
        <View className="mb-2 items-center gap-y-3">
          <Image
            source={{ uri: currentInstructor?.image }}
            className="size-24 rounded-full"
            resizeMode="contain"
          />

          <View className="items-center">
            <Text className="mb-1 font-inter-bold text-lg">
              {currentInstructor.firstName} {currentInstructor.lastName}
            </Text>
            <Text className="font-inter text-subtext">
              Employee ID: {currentInstructor.employeeId}
            </Text>
            <Text className="font-inter text-subtext">
              Department:{" "}
              <Text className="uppercase">
                {currentInstructor.departmentName}
              </Text>
            </Text>
            <Text className="font-inter text-subtext">
              Email: {currentInstructor.email}
            </Text>
          </View>
        </View>
      </View>

      {/* Timetable */}
      <View className="flex-row">
        {/* Time Column */}
        <View className="border-r border-border bg-gray-200">
          <View className="items-center justify-center border-b border-border px-5 py-2">
            <Text className="font-inter-semibold text-subtext">Time</Text>
          </View>

          {TIMES.map((time) => (
            <View
              className="items-center justify-center border-b border-border px-5"
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
                <View className="items-center justify-center border-b border-r border-border bg-blue px-10 py-2">
                  <Text className="font-inter-bold text-white">{dayName}</Text>
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
                        schedule.startTime === currentTime,
                    );

                    if (matchingSchedule) {
                      const scheduleStart = timeToMinutes(
                        matchingSchedule.startTime,
                      );
                      const scheduleEnd = timeToMinutes(
                        matchingSchedule.endTime,
                      );
                      const durationMinutes = scheduleEnd - scheduleStart;
                      const blockHeight = (durationMinutes / 30) * 30;

                      const rowsToSpan = durationMinutes / 30;
                      skipCount = rowsToSpan - 1;

                      cells.push(
                        <View
                          key={`${dayIndex}-${i}`}
                          className="w-40 items-center justify-center border-b border-l-4 border-r border-b-border border-l-blue border-r-border bg-blue/10"
                          style={{
                            height: blockHeight,
                          }}
                        >
                          <Text className="mb-1 text-center font-inter-semibold leading-relaxed">
                            {matchingSchedule.roomName}
                          </Text>
                          <Text className="font-inter text-sm text-subtext">
                            {matchingSchedule.startTime} -{" "}
                            {matchingSchedule.endTime}
                          </Text>
                        </View>,
                      );
                    } else {
                      cells.push(
                        <View
                          className="w-40 border-b border-r border-border"
                          key={`${dayIndex}-${i}`}
                          style={{ height: 30 }}
                        />,
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

export default AdminInstructorDetails;
