import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import useRoomStore from "@/store/useRoomStore";
import { Ionicons } from "@expo/vector-icons";
import AddScheduleModal from "@/components/admin/feedback/AddScheduleModal";
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

const AdminRoomDetails = () => {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { currentRoom, schedules, fetchRoom, fetchSchedulesForRoom } =
    useRoomStore();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        setLoading(true);
        await Promise.all([fetchRoom(id), fetchSchedulesForRoom(id)]);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity className="flex-row items-center gap-x-2 pr-4">
          <Ionicons name="ellipsis-vertical" size={20} />
        </TouchableOpacity>
      ),
    });
  }, []);

  if (loading || !currentRoom) {
    return <Loader />;
  }

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false} className="bg-white">
        {currentRoom && (
          <View className="flex-row gap-x-5 px-8 pb-6 py-2 gap-y-1">
            <Image
              source={{ uri: currentRoom?.imageURL }}
              className={`rounded-lg aspect-square`}
              resizeMode="cover"
            />
            <View>
              <View className="flex-row items-center gap-x-4">
                <Text className="font-inter-bold text-xl">
                  {currentRoom.roomName}
                </Text>
                <Text className="bg-green/10 text-green self-start px-3 py-1 rounded-full font-inter-semibold text-xs">
                  Available
                </Text>
              </View>
              <Text className="font-inter">Current Occuapant: None</Text>
              <Text className="font-inter">
                Department: {currentRoom.departmentId?.toUpperCase()}
              </Text>
              <Text className="font-inter">
                Building: {currentRoom.building}
              </Text>
            </View>
          </View>
        )}

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
                    <Text className="text-white font-inter-bold">
                      {dayName}
                    </Text>
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

                      const matchingSchedule = schedules.find((schedule) => {
                        if (schedule.day !== dayIndex + 1) return false;
                        return schedule.startTime === currentTime;
                      });

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

                        // Schedule block
                        cells.push(
                          <View
                            key={`${dayIndex}-${i}`}
                            className="w-40 bg-blue/10 border-l-4 border-b border-r border-r-border border-l-blue border-b-border justify-center items-center"
                            style={{
                              height: blockHeight,
                            }}
                          >
                            <Text className="mb-2 font-inter-semibold leading-relaxed">
                              {matchingSchedule.instructorName}
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

      <TouchableOpacity
        onPress={() => setShowModal(true)}
        activeOpacity={0.7}
        className="flex-row items-center gap-x-2 bg-blue px-5 py-4 absolute bottom-5 right-5 rounded-full"
        style={{ elevation: 4 }}
      >
        <Ionicons name="add" size={16} color="white" />
        <Text className="font-inter-bold text-white">Add Schedule</Text>
      </TouchableOpacity>

      <AddScheduleModal
        roomId={currentRoom?.id}
        showModal={showModal}
        setShowModal={setShowModal}
      />
    </>
  );
};

export default AdminRoomDetails;
