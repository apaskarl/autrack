import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Image,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import React, { useState, useCallback, useLayoutEffect } from "react";
import { router, useNavigation } from "expo-router";
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import useRoomStore from "@/store/useRoomStore";
import IonicButton from "@/components/shared/ui/IonicButton";
import AdminHomeLayout from "@/components/admin/layouts/AdminHomeLayout";
import { styles } from "@/styles/styles";
import { COLORS } from "@/constants/colors";
import Loader from "@/components/shared/ui/Loader";

type Facilities = {
  airConditioned: boolean;
  blackboard: boolean;
  tv: boolean;
  wifi: boolean;
  projector: boolean;
};

const AdminRooms = () => {
  const navigation = useNavigation();
  const { rooms, fetchRooms, deleteRoom, loading } = useRoomStore();
  const [refreshing, setRefreshing] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);

  const facilityIcons: {
    key: keyof Facilities;
    icon: string;
    library: any;
    size: number;
  }[] = [
    {
      key: "airConditioned",
      icon: "snowflake",
      library: FontAwesome5,
      size: 9,
    },
    { key: "tv", icon: "tv", library: FontAwesome5, size: 9 },
    { key: "wifi", icon: "wifi", library: FontAwesome5, size: 9 },
    { key: "blackboard", icon: "chalkboard", library: FontAwesome5, size: 9 },
    {
      key: "projector",
      icon: "projector-screen-outline",
      library: MaterialCommunityIcons,
      size: 11,
    },
  ];

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchRooms?.();
    setRefreshing(false);
  }, [fetchRooms]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => setShowSearch(true)}
          className="p-3 bg-gray-100 rounded-full mr-4"
        >
          <Ionicons name="search" size={18} />
        </TouchableOpacity>
      ),
    });
  }, []);

  return (
    <>
      {loading && (
        <View className="z-50 inset-0 absolute h-screen w-screen opacity-50">
          <Loader />
        </View>
      )}

      <ScrollView
        className="bg-white"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <AdminHomeLayout>
          {showSearch && (
            <View className="relative mb-6">
              <TextInput
                placeholder="Search"
                className="px-5 py-4 border font-inter-medium border-border rounded-full"
              />
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => setShowSearch(false)}
                className="absolute right-5 top-1/2 -translate-y-1/2 p-3 mr-[-8px] rounded-full"
              >
                <Ionicons name="close" size={20} />
              </TouchableOpacity>
            </View>
          )}

          <View className="flex-row gap-x-3 mb-6">
            <TouchableOpacity className="flex-row items-center gap-x-2 border border-border px-4 py-2 rounded-full">
              <Text className="font-inter-medium text-sm">Departments</Text>
              <Ionicons name="caret-down-outline" size={15} />
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center gap-x-2 border border-border px-4 py-2 rounded-full">
              <Text className="font-inter-medium text-sm">Facilities</Text>
              <Ionicons name="caret-down-outline" size={15} />
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center justify-between mb-8">
            {rooms && (
              <Text className="text-sm text-subtext font-inter">
                {rooms.length} rooms
              </Text>
            )}
            <TouchableOpacity className="flex-row items-center gap-x-2">
              <Text className="font-inter-medium text-sm">Sort by</Text>
              <Ionicons name="caret-down-outline" size={15} />
            </TouchableOpacity>
          </View>

          <View>
            {rooms.map((room) => (
              <View key={room.id} className="relative mb-6">
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() =>
                    router.push({
                      pathname: "/admin/(tabs)/home/room-details",
                      params: { id: room.id },
                    })
                  }
                  className="flex-row w-full rounded-xl bg-white"
                  style={styles.shadow}
                >
                  <Image
                    source={{ uri: room.image }}
                    className={`aspect-square rounded-l-xl`}
                    resizeMode="cover"
                  />

                  <View className="ml-4 gap-y-1 py-3">
                    <View className="flex-row items-center gap-x-3">
                      <Text className="font-inter-bold">{room.name}</Text>
                      <Text
                        className={`${
                          room.isAvailable
                            ? "bg-green/10 text-green"
                            : "bg-red/10 text-red"
                        } px-3 py-1 rounded-full font-inter-semibold text-[10px]`}
                      >
                        {room.isAvailable ? "Available" : "Unavailble"}
                      </Text>
                    </View>
                    <Text className="font-inter-semibold text-sm">
                      {room.departmentId}
                    </Text>
                    <Text className="font-inter text-sm text-subtext">
                      Building: {room.buildingId}
                    </Text>

                    {/* Facilites */}
                    <View className="flex-row items-center gap-x-2 mt-2">
                      <View className="flex-row items-center gap-x-1">
                        <Ionicons
                          name="people-outline"
                          size={15}
                          color={COLORS.subtext}
                        />
                        <Text className="font-inter-medium text-sm text-subtext">
                          {room.capacity}
                        </Text>
                      </View>

                      {facilityIcons.map(
                        ({ key, icon, library: IconComponent, size }) =>
                          room.facilities?.[key] ? (
                            <IconComponent
                              key={key}
                              name={icon}
                              size={size}
                              color={COLORS.subtext}
                            />
                          ) : null
                      )}
                    </View>
                  </View>
                </TouchableOpacity>

                <IonicButton
                  onPress={() =>
                    setActiveRoomId(activeRoomId === room.id ? null : room.id)
                  }
                  icon="ellipsis-vertical"
                  size={20}
                  className="z-50 absolute right-3 top-3"
                />

                {activeRoomId === room.id && (
                  <View
                    className="z-20 bg-white border border-border/30 rounded-xl absolute right-6 top-12"
                    style={styles.shadow}
                  >
                    <TouchableOpacity
                      className="px-5 pt-4 pb-2"
                      onPress={() => {
                        if (!activeRoomId) return;

                        Alert.alert(
                          "Delete Room",
                          "Are you sure you want to delete this room?",
                          [
                            {
                              text: "Cancel",
                              style: "cancel",
                            },
                            {
                              text: "Delete",
                              onPress: async () => {
                                setActiveRoomId(null);
                                await deleteRoom(activeRoomId);
                              },
                              style: "destructive",
                            },
                          ],
                          { cancelable: true }
                        );
                      }}
                    >
                      <Text className="font-inter-medium">Delete room</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setActiveRoomId(null);
                        router.push({
                          pathname: "/admin/(tabs)/home/edit-room",
                          params: { id: room.id },
                        });
                      }}
                      className="px-5 pt-2 pb-4"
                    >
                      <Text className="font-inter-medium">Edit room</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </View>
        </AdminHomeLayout>

        {activeRoomId && (
          <TouchableWithoutFeedback onPress={() => setActiveRoomId(null)}>
            <View className="z-10 absolute inset-0 h-screen w-screen" />
          </TouchableWithoutFeedback>
        )}
      </ScrollView>

      <TouchableOpacity
        onPress={() => router.push("/admin/(tabs)/home/add-room")}
        activeOpacity={0.7}
        className="flex-row items-center gap-x-2 bg-blue px-6 py-4 absolute bottom-5 right-5 rounded-full"
        style={{ elevation: 2 }}
      >
        <Text className="font-inter-bold text-white">Add Room</Text>
        <Ionicons name="arrow-forward" size={16} color="white" />
      </TouchableOpacity>
    </>
  );
};

export default AdminRooms;
