import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Switch,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import useUserStore from "@/store/useUserStore";
import useRoomStore from "@/store/useRoomStore";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
  const { user } = useUserStore();
  const { rooms, fetchRooms } = useRoomStore();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchRooms();
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const loadRooms = async () => {
      setLoading(true);
      try {
        await fetchRooms();
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, [fetchRooms]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="px-8 py-5">
          <View>
            <View className="mb-5 flex-row items-center justify-between">
              {/* <View className="flex-row gap-x-4 items-center">
                <Image
                  source={{ uri: user?.photoURL }}
                  className={`size-12 rounded-full`}
                  resizeMode="contain"
                />

                <View className="">
                  <Text className="font-inter-medium">Hello,</Text>
                  <Text className="font-inter-semibold text-xl">
                    {user?.firstName}
                  </Text>
                </View>
              </View> */}
              <View className="flex-row items-center gap-x-2">
                <Image
                  source={require("../../../assets/images/logos/logo-outline-primary.png")}
                  className="size-12"
                  resizeMode="contain"
                />
                <Text className="font-inter-bold text-xl tracking-tight">
                  AuTrack
                </Text>
              </View>

              <Ionicons name="menu" size={28} />
            </View>

            <Text className="mb-4 text-2xl font-inter-bold">Rooms</Text>

            <View className="mb-4 flex-row gap-x-2 items-center">
              <View className="relative flex-1">
                <TextInput
                  className="border border-border pl-14 pr-5 py-4 font-inter rounded-lg"
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
                <Ionicons name="filter" size={21} color="black" />
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center gap-x-5">
                <Text className="font-inter-medium text-sm text-subtext">
                  Show Available Rooms Only
                </Text>
                <Switch />
              </View>

              <TouchableOpacity
                onPress={onRefresh}
                className="flex-row px-5 mr-[-15px] py-2 items-center gap-x-2"
              >
                <Ionicons name="refresh-outline" size={20} color="black" />
                <Text className="text-sm font-inter-semibold">Refresh</Text>
              </TouchableOpacity>
            </View>
          </View>

          {loading ? (
            <View className="items-center justify-center py-10">
              <Text className="text-subtext mb-4 font-inter-medium text-sm">
                Loading rooms...
              </Text>
              <ActivityIndicator />
            </View>
          ) : (
            <View className="gap-y-5">
              {rooms.map((item) => (
                <View
                  key={item.id}
                  className="relative border border-border bg-white p-5 rounded-lg"
                >
                  <Text
                    className={`${
                      item.is_available
                        ? "bg-green/10 text-green"
                        : "bg-red/10 text-red"
                    } absolute flex-row px-4 py-2 rounded-lg items-center gap-x-2 font-inter-semibold right-5 top-4 text-xs`}
                  >
                    {item.is_available ? "Available" : "Unavailable"}
                  </Text>

                  <View
                    className={`${
                      !item.is_available && "opacity-40"
                    } flex-row items-center gap-x-2 border-b border-border pb-4 mb-4`}
                  >
                    <MaterialIcons
                      name={
                        item.is_available ? "meeting-room" : "no-meeting-room"
                      }
                      size={20}
                    />
                    <Text className="font-inter-bold text-lg ">
                      {item.room_name}
                    </Text>
                  </View>

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
                      className={`${
                        item.is_available ? "bg-blue" : "bg-subtext/60"
                      } flex-row items-center gap-x-2  self-start rounded-lg px-5 py-3`}
                      disabled={!item.is_available}
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
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
