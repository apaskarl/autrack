import { View, Text, ActivityIndicator, Button } from "react-native";
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

  useEffect(() => {
    if (id) {
      fetchRoom(id);
      fetchSchedulesForRoom(id);
    }
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (error || !currentRoom) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg">{error || "Room not found."}</Text>
      </View>
    );
  }

  return (
    <View className="p-6">
      <Text className="text-2xl font-bold">{currentRoom.room_name}</Text>
      <Text className="text-lg text-gray-600 mt-2">
        Building: {currentRoom.building}
      </Text>

      <AddScheduleForm roomId={currentRoom.id} />

      <View className="mt-4">
        <Text className="text-xl font-semibold mb-2">Weekly Schedule:</Text>
        {schedules.length === 0 ? (
          <Text className="text-gray-500">No schedule yet.</Text>
        ) : (
          schedules.map((s) => (
            <View key={s.id} className="mb-2 p-2 bg-gray-100 rounded">
              <Text className="font-semibold">{s.day}</Text>
              <Text>
                {s.start_time} - {s.end_time}
              </Text>
              <Text>Instructor: {s.instructor_name}</Text>
            </View>
          ))
        )}
      </View>
    </View>
  );
};

export default Room;
