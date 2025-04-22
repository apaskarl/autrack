import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import useRoomStore from "@/store/useRoomStore";
import AddScheduleForm from "@/components/admin/AddScheduleForm";

const Room = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    currentRoom,
    loading,
    error,
    fetchRoom,
    fetchSchedulesForRoom,
    schedules,
  } = useRoomStore();

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (id) {
      fetchRoom(id);
      fetchSchedulesForRoom(id);
    }
  }, [id]);

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const timeSlots: string[] = [];
  for (let hour = 7; hour < 18; hour++) {
    const startTime = hour.toString().padStart(2, "0") + ":00";
    const endTime = (hour + 1).toString().padStart(2, "0") + ":00";
    timeSlots.push(`${startTime}-${endTime}`);
  }

  const buildScheduleMap = () => {
    const map: Record<string, Record<string, any>> = {};

    schedules.forEach((schedule) => {
      const { day, start_time, end_time } = schedule;
      if (!map[day]) map[day] = {};

      const startHour = parseInt(start_time.split(":")[0], 10);
      const endHour = parseInt(end_time.split(":")[0], 10);
      const span = endHour - startHour;

      for (let hour = startHour; hour < endHour; hour++) {
        const timeStr = hour.toString().padStart(2, "0") + ":00";
        map[day][timeStr] = {
          ...schedule,
          isStart: timeStr === start_time,
          span,
        };
      }
    });

    return map;
  };

  const scheduleMap = buildScheduleMap();

  if (loading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (error || !currentRoom) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <Text className="text-lg">{error || "Room not found."}</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 px-8 bg-white">
      <View className="relative mb-5">
        <Text className="text-2xl font-inter-bold mb-2">
          {currentRoom.room_name}
        </Text>
        <Text className="font-inter-medium">2025/22/4 - 2025/22/4</Text>

        <TouchableOpacity
          onPress={() => setShowModal(true)}
          className="bg-blue absolute right-0 self-start px-4 py-2 rounded-lg"
        >
          <Text className="font-inter-semibold text-white">Add Schedule</Text>
        </TouchableOpacity>
      </View>

      <AddScheduleForm
        roomId={currentRoom.id}
        showModal={showModal}
        setShowModal={setShowModal}
      />

      <View className="mt-4">
        <Text className="text-xl font-inter-semibold mb-4">
          Weekly Schedule:
        </Text>

        {schedules.length === 0 ? (
          <Text className="text-gray-500">No schedule yet.</Text>
        ) : (
          <View className="flex-row overflow-hidden mb-10">
            {/* Time Column */}
            <View className="z-10 bg-light">
              <View className="p-2 justify-cente border-r items-center">
                <Text className="text-black">Time</Text>
              </View>
              {timeSlots.map((timeSlot) => (
                <View
                  key={timeSlot}
                  className="border-b p-2 min-h-[60px] justify-center border-r"
                >
                  <Text>{timeSlot}</Text>
                </View>
              ))}
            </View>

            {/* Schedule Grid */}
            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
              <View>
                {/* Day Headers */}
                <View className="flex-row">
                  {days.map((day) => (
                    <View key={day} className="w-[120px] p-2 bg-blue">
                      <Text className="text-white text-center">{day}</Text>
                    </View>
                  ))}
                </View>

                {/* Schedule Columns */}
                <View className="flex-row relative">
                  {days.map((day) => (
                    <View
                      key={day}
                      className="w-[120px] border-r border-red"
                      style={{
                        height: timeSlots.length * 60,
                      }}
                    >
                      {timeSlots.map((time, rowIndex) => {
                        const schedule = scheduleMap[day]?.[time.split("-")[0]];
                        if (!schedule || !schedule.isStart) return null;

                        return (
                          <View
                            key={`${day}-${time}`}
                            className="absolute bg-blue/80 justify-center items-center w-full"
                            style={{
                              top: rowIndex * 60,
                              height: schedule.span * 60,
                            }}
                          >
                            <View>
                              <Text className="text-white">
                                {schedule.instructor_name}
                              </Text>
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  ))}
                </View>
              </View>
            </ScrollView>
          </View>
        )}
      </View>
    </ScrollView>
  );
};
export default Room;
