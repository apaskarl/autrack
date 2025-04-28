import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  ScrollView,
  RefreshControl,
  Image,
} from "react-native";
import React, { useState, useCallback, useLayoutEffect } from "react";
import { router, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";
import useRoomStore from "@/store/useRoomStore";
import IonicButton from "@/components/shared/ui/IonicButton";
import AdminHomeLayout from "@/components/admin/layouts/AdminHomeLayout";
import AddRoomModal from "@/components/admin/feedback/AddRoomModal";

const AdminRooms = () => {
  const navigation = useNavigation();
  const { rooms, fetchRooms } = useRoomStore();
  const [showModal, setShowModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchRooms?.();
    setRefreshing(false);
  }, [fetchRooms]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity className="flex-row items-center gap-x-2 pr-4">
          <Ionicons name="search" size={20} />
        </TouchableOpacity>
      ),
    });
  }, []);

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <AdminHomeLayout>
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
            {rooms.map((room, index) => (
              <View
                key={room.id}
                className={`${
                  index !== rooms.length - 1
                    ? "border-b border-border mb-5"
                    : ""
                } relative flex-row justify-between pb-5`}
              >
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() =>
                    router.push({
                      pathname: "/admin/(tabs)/home/room-details",
                      params: { id: room.id },
                    })
                  }
                  className="flex-row gap-x-4 flex-1"
                >
                  <Image
                    source={{ uri: room?.imageURL }}
                    className={`rounded-lg aspect-square`}
                    resizeMode="cover"
                  />
                  <View className="gap-y-1">
                    <View className="flex-row items-center gap-x-2">
                      <Text className="font-inter-bold text-lg">
                        {room.roomName}
                      </Text>

                      <Text className="bg-green/10 text-green self-start px-3 py-1 rounded-full font-inter-semibold text-xs">
                        Available
                      </Text>
                    </View>
                    <Text className="uppercase font-inter-semibold text-sm">
                      {room.departmentId}
                    </Text>
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
        </AdminHomeLayout>
      </ScrollView>

      <TouchableOpacity
        onPress={() => setShowModal(true)}
        activeOpacity={0.7}
        className="flex-row items-center gap-x-2 bg-blue px-5 py-4 absolute bottom-5 right-5 rounded-full"
        style={{ elevation: 4 }}
      >
        <Ionicons name="add" size={16} color="white" />
        <Text className="font-inter-bold text-white">Add Room</Text>
      </TouchableOpacity>

      <AddRoomModal showModal={showModal} setShowModal={setShowModal} />
    </>
  );
};

export default AdminRooms;
