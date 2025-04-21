import {
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  Switch,
} from "react-native";
import React, { useEffect, useState } from "react";
import InstructorLayout from "@/components/instructor/InstructorLayout";
import useUserStore from "@/store/useUserStore";
import useRoomStore from "@/store/useRoomStore";
import { Feather, Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";

const Home = () => {
  const { user } = useUserStore();
  const { rooms, fetchRooms } = useRoomStore();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchRooms();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  return (
    <InstructorLayout>
      <View className="flex-1 pt-8">
        {/* Header */}
        <View>
          <View className="mb-5 flex-row items-center justify-between">
            <View className="flex-row gap-x-4 items-center">
              <Image
                source={{ uri: user?.photoURL }}
                className={`size-14 rounded-full`}
                resizeMode="contain"
              />

              <View className="">
                <Text className="font-inter-medium">Hello,</Text>
                <Text className="font-inter-semibold text-xl">
                  {user?.firstName}
                </Text>
              </View>
            </View>

            <Ionicons name="menu" size={30} />
          </View>

          <Text className="mb-3 text-3xl font-inter-bold">Rooms</Text>

          <View className="mb-4 flex-row gap-x-2 items-center">
            <View className="relative flex-1">
              <TextInput
                className="border pl-14 pr-5 py-4 font-inter border-border rounded-lg"
                placeholder="Search"
              />
              <Ionicons
                name="search"
                size={20}
                className="absolute top-1/2 -translate-y-1/2 left-5"
                color={COLORS.subtext}
              />
            </View>

            <TouchableOpacity className="items-center h-full pl-3 flex-row">
              <Feather name="filter" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <View className="mb-4 flex-row items-center gap-x-5">
            <Text className="font-inter-medium">
              Show Avaiilable Rooms Only
            </Text>
            <Switch />
          </View>
        </View>

        <FlatList
          data={rooms}
          keyExtractor={(item) => item.id}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View className="relative border border-border p-5 mb-6 rounded-lg">
              <Text
                className={`${
                  item.is_available
                    ? "bg-green/10 text-green"
                    : "bg-red/10 text-red"
                } absolute flex-row px-4 py-2 rounded-lg items-center gap-x-2 font-inter-semibold right-5 top-4 text-xs`}
              >
                {item.is_available ? "Available" : "Unavailable"}
              </Text>

              <Text className="font-inter-bold border-b text-lg border-border pb-4 mb-4">
                {item.room_name}
              </Text>

              <View className="gap-y-2 mb-3">
                <Text className="text-subtext font-inter">
                  Building:{" "}
                  <Text className="text-black font-inter-medium">
                    {item.building || "None"}
                  </Text>
                </Text>
                <Text className="text-subtext font-inter">
                  Occupant:{" "}
                  <Text className="text-black font-inter-medium">
                    {item.current_occupant || "None"}
                  </Text>
                </Text>
                <Text className="text-subtext font-inter">
                  Time:{" "}
                  <Text className="text-black font-inter-medium">
                    {item.current_occupant || "--:--"}
                  </Text>
                </Text>
              </View>

              <View className="flex-row items-center gap-x-3 ml-auto">
                <TouchableOpacity
                  activeOpacity={0.7}
                  className="flex-row items-center gap-x-2 border border-border self-start rounded-lg px-5 py-3"
                >
                  <Ionicons
                    name="eye-outline"
                    size={16}
                    color={COLORS.subtext}
                  />
                  <Text className="font-inter-semibold text-sm text-subtext">
                    View Details
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  className="flex-row items-center gap-x-2 bg-blue self-start rounded-lg px-5 py-3"
                >
                  <Ionicons
                    name="enter-outline"
                    size={16}
                    color={COLORS.white}
                  />
                  <Text className="font-inter-semibold text-sm text-white">
                    Occupy
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </InstructorLayout>
  );
};

export default Home;
