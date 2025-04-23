import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import useRoomStore from "@/store/useRoomStore";
import { ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useInstructorStore } from "@/store/useInstructorStore"; // Import Zustand store
import LogoName from "@/components/common/LogoName";
import IonicButton from "@/components/common/buttons/IonicButton";
import CardContainer from "@/components/admin/CardContainer";

const HomeAdmin = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { rooms, fetchRooms } = useRoomStore();
  const { instructors, fetchInstructors } = useInstructorStore(); // Get instructors from Zustand store

  const fetchAllData = async () => {
    try {
      // Fetch both rooms and instructors simultaneously
      await Promise.all([fetchRooms(), fetchInstructors()]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const initialLoad = async () => {
      setLoading(true);
      await fetchAllData(); // Fetch rooms and instructors
      setLoading(false);
    };

    initialLoad();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAllData();
    setRefreshing(false);
  }, []);

  return (
    <View className="bg-white flex-1">
      {loading ? (
        <View className="flex-1 bg-white justify-center items-center">
          <ActivityIndicator size="large" color="black" />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View className="px-8 pt-5">
            <View className="mb-8 flex-row items-center justify-between">
              <LogoName />
              <View className="mr-[-8px]">
                <IonicButton icon="menu" />
              </View>
            </View>

            <View className="mb-8 h-[25vh] w-full rounded-xl shadow-md shadow-black/10 bg-light"></View>
          </View>

          {/* Rooms */}
          <CardContainer
            title="Rooms"
            route={() => router.push("/admin/screens/rooms")}
          >
            {rooms.map((room, index) => (
              <TouchableOpacity
                key={room.id}
                activeOpacity={0.5}
                onPress={() =>
                  router.push({
                    pathname: "/admin/screens/room",
                    params: { id: room.id },
                  })
                }
                className={`p-5 mr-5 w-[250px] border border-border rounded-xl flex-row gap-x-4 ${
                  index === 0 ? "ml-8" : ""
                }`}
              >
                <View className="p-5 rounded-lg bg-light aspect-square"></View>
                <View>
                  <View className="mb-2 flex-row items-center gap-x-2">
                    <Text className="font-inter-bold">{room.roomName}</Text>
                    <Text className="bg-green/10 text-green self-start px-3 py-1 rounded-full font-inter-semibold text-xs">
                      Available
                    </Text>
                  </View>
                  <Text className="font-inter text-sm text-subtext">
                    Occupant: None
                  </Text>
                  <Text className="font-inter text-sm text-subtext">
                    Time: --:-- - --:--
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </CardContainer>

          {/* Instructors */}
          <CardContainer
            title="Instructors"
            route={() => router.push("/admin/screens/instructors")}
          >
            {instructors.map((item, index) => (
              <View
                key={item.id}
                className={`items-center w-28 mr-2 gap-x-4 ${
                  index === 0 ? "ml-8" : ""
                }`}
              >
                <Image
                  source={{ uri: item?.photoURL }}
                  className="size-20 rounded-full mb-2"
                  resizeMode="contain"
                />
                <Text className="font-inter-bold px-2 text-center">
                  {item.firstName} {item.lastName}
                </Text>
              </View>
            ))}
          </CardContainer>

          <View className="px-8">
            <Text className="mb-6 rounded-lg font-inter-bold text-2xl">
              Ongoing Classes
            </Text>

            <View className="mb-5 h-[10vh] w-full rounded-xl shadow-md shadow-black/10 bg-light"></View>
            <View className="mb-10 h-[10vh] w-full rounded-xl shadow-md shadow-black/10 bg-light"></View>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default HomeAdmin;
