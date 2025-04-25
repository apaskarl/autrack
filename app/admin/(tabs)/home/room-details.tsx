import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import useRoomStore from "@/store/useRoomStore";
import { RefreshControl } from "react-native";
import IonicButton from "@/components/shared/ui/IonicButton";
import AddScheduleModal from "@/components/admin/feedback/AddScheduleModal";

const AdminRoomDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    currentRoom,
    loading,
    error,
    fetchRoom,
    fetchSchedulesForRoom,
    schedules,
  } = useRoomStore();
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleRefresh = async () => {
    if (!id) return;
    setRefreshing(true);
    await fetchRoom(id);
    await fetchSchedulesForRoom(id);
    setRefreshing(false);
  };

  useEffect(() => {
    if (id) {
      fetchRoom(id);
      fetchSchedulesForRoom(id);
    }
  }, [id]);

  const days = [
    // "Sunday",
    "Monday", // 1
    "Tuesday", // 2
    "Wednesday", // 3
    "Thursday", // 4
    "Friday", // 5
    "Saturday", // 6
  ];

  const timeSlots: string[] = [];
  for (let hour = 7; hour < 21; hour++) {
    const startTime = hour.toString().padStart(2, "0") + ":00";
    const endTime = (hour + 1).toString().padStart(2, "0") + ":00";
    timeSlots.push(`${startTime}-${endTime}`);
  }

  const buildScheduleMap = () => {
    const map: Record<number, Record<string, any>> = {};

    schedules.forEach((schedule) => {
      const { day, startTime, endTime } = schedule;
      if (!map[day]) map[day] = {};

      const startHour = parseInt(startTime.split(":")[0], 10);
      const endHour = parseInt(endTime.split(":")[0], 10);
      const span = endHour - startHour;

      for (let hour = startHour; hour < endHour; hour++) {
        const timeStr = hour.toString().padStart(2, "0") + ":00";
        map[day][timeStr] = {
          ...schedule,
          isStart: timeStr === startTime,
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
        <ActivityIndicator size="large" color="#000000" />
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
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
      className="flex-1 bg-white"
    >
      <AddScheduleModal
        roomId={currentRoom.id}
        showModal={showModal}
        setShowModal={setShowModal}
      />

      <View className="pt-8 mb-6 flex-row items-center justify-between px-8">
        <Text className="font-inter-bold text-2xl">{currentRoom.roomName}</Text>
        <IonicButton
          onPress={() => setShowModal(true)}
          icon="calendar-outline"
          label="Add Schedule"
          size={16}
          className="mr-[-8px]"
        />
      </View>

      <View>
        {schedules.length === 0 ? (
          <View className="flex-1 bg-white py-10 justify-center items-center">
            <Text className="text-subtext">No schedule yet.</Text>
          </View>
        ) : (
          <View className="flex-row overflow-hidden border border-border">
            {/* Time Colums */}
            <View className="z-10 bg-light border-r border-border">
              <View className="py-2 px-4 justify-center items-center">
                <Text className="text-black">Time</Text>
              </View>
              {timeSlots.map((timeSlot) => (
                <View
                  key={timeSlot}
                  className="py-2 px-4 border-t border-border min-h-[60px] justify-center items-center"
                >
                  <Text>{timeSlot}</Text>
                </View>
              ))}
            </View>

            {/* Schedule Columns */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View>
                {/* Day Headers */}
                <View className="flex-row">
                  {days.map((day) => (
                    <View
                      key={day}
                      className="w-[120px] p-2 border-b border-r border-border bg-blue"
                    >
                      <Text className="text-white text-center">{day}</Text>
                    </View>
                  ))}
                </View>

                {/* Schedule Columns */}
                <View className="flex-row relative">
                  {days.map((_, dayIndex) => (
                    <View
                      key={dayIndex}
                      className="w-[120px] border-r border-border"
                      style={{ height: timeSlots.length * 60 }}
                    >
                      {timeSlots.map((time, rowIndex) => {
                        const schedule =
                          scheduleMap[dayIndex + 1]?.[time.split("-")[0]]; // Offset by 1
                        if (!schedule || !schedule.isStart) return null;

                        return (
                          <View
                            key={`${dayIndex}-${time}`}
                            className="absolute border-l-4 border-blue bg-blue/10 justify-center items-center w-full"
                            style={{
                              top: rowIndex * 60,
                              height: schedule.span * 60,
                            }}
                          >
                            <Text className="text-black">
                              {schedule.instructorName}
                            </Text>
                            <Text className="text-black">
                              {schedule.startTime} - {schedule.endTime}
                            </Text>
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

export default AdminRoomDetails;
