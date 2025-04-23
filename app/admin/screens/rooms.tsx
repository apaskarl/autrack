import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useState, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";
import useRoomStore from "@/store/useRoomStore";
import { router } from "expo-router";
import IonicButton from "@/components/common/buttons/IonicButton";
import AddRoomModal from "@/components/admin/AddRoomModal";

const Rooms = () => {
  const { rooms, fetchRooms } = useRoomStore();
  const [showModal, setShowModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchRooms?.();
    setRefreshing(false);
  }, [fetchRooms]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      className="flex-1 bg-white px-8"
    >
      <AddRoomModal showModal={showModal} setShowModal={setShowModal} />

      <View className="mb-6 flex-row justify-between items-center">
        <Text className="font-inter-bold text-3xl">Rooms</Text>
        <IonicButton
          onPress={() => setShowModal(true)}
          icon="add"
          label="Add Room"
          size={20}
          className="mr-[-8px]"
        />
      </View>

      <View className="mb-4 flex-row gap-x-2 items-center">
        <View className="relative flex-1">
          <TextInput
            className="border border-border pl-14 pr-5 py-4 font-inter rounded-lg"
            placeholder="Search"
          />
          <Ionicons
            name="search"
            size={16}
            className="absolute top-1/2 -translate-y-1/2 left-5"
            color={COLORS.subtext}
          />
        </View>
        <TouchableOpacity className="items-center h-full pl-3 flex-row">
          <Ionicons name="filter" size={21} color="black" />
        </TouchableOpacity>
      </View>

      <View className="mb-6 flex-row items-center gap-x-5">
        <Text className="font-inter-medium text-sm text-subtext">
          Show Available Rooms Only
        </Text>
        <Switch />
      </View>

      <View>
        {rooms.map((room) => (
          <View
            key={room.id}
            className="relative flex-row justify-between border-b border-border pb-5 mb-5"
          >
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() =>
                router.push({
                  pathname: "/admin/screens/room",
                  params: { id: room.id },
                })
              }
              className="flex-row gap-x-4 flex-1"
            >
              <View className="p-5 rounded-lg bg-light aspect-square" />
              <View className="gap-y-1">
                <View className="mb-2 flex-row items-center gap-x-2">
                  <Text className="font-inter-bold text-lg">
                    {room.roomName}
                  </Text>
                  <Text className="bg-green/10 text-green self-start px-3 py-1 rounded-full font-inter-semibold text-xs">
                    Available
                  </Text>
                </View>
                <Text className="font-inter text-sm text-subtext">
                  Current Occupant: None
                </Text>
                <Text className="font-inter text-sm text-subtext">
                  Time: --:-- - --:--
                </Text>
              </View>
            </TouchableOpacity>

            <IonicButton
              icon="ellipsis-vertical"
              size={20}
              className="absolute right-0 mr-[-8px] top-[-8px]"
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default Rooms;
