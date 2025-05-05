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
import AddButton from "@/components/admin/ui/AddButton";

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
  const [showSearch, setShowSearch] = useState(true);
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
    setTimeout(() => {
      setRefreshing(false);
    }, 0);
    await fetchRooms?.();
  }, [fetchRooms]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => setShowSearch(true)}
          className="rounded-full bg-gray-100 p-3"
        >
          <Ionicons name="search" size={18} />
        </TouchableOpacity>
      ),
    });
  }, []);

  return (
    <>
      {loading && (
        <View className="absolute inset-0 z-50 h-screen w-screen opacity-50">
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
              <Ionicons
                name="search"
                size={20}
                className="absolute left-6 top-1/2 z-10 -translate-y-1/2 rounded-full"
                color={COLORS.subtext}
              />
              <TextInput
                placeholder="Search"
                className="rounded-full border border-border bg-light py-4 pl-16 pr-5 font-inter-medium"
              />
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => setShowSearch(false)}
                className="absolute right-5 top-1/2 mr-[-8px] -translate-y-1/2 rounded-full p-3"
              >
                <Ionicons name="close" size={20} />
              </TouchableOpacity>
            </View>
          )}

          <View className="mb-6 flex-row gap-x-3">
            <TouchableOpacity className="flex-row items-center gap-x-2 rounded-full border border-border px-4 py-2">
              <Text className="font-inter-medium text-sm">Departments</Text>
              <Ionicons name="caret-down-outline" size={15} />
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center gap-x-2 rounded-full border border-border px-4 py-2">
              <Text className="font-inter-medium text-sm">Facilities</Text>
              <Ionicons name="caret-down-outline" size={15} />
            </TouchableOpacity>
          </View>

          <View className="mb-6 flex-row items-center justify-between">
            {rooms && (
              <Text className="font-inter text-sm text-subtext">
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
                  activeOpacity={0.7}
                  onPress={() =>
                    router.push({
                      pathname: "/admin/(tabs)/home/room-details",
                      params: { id: room.id },
                    })
                  }
                  className="w-full flex-row rounded-xl bg-white"
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
                        } rounded-full px-3 py-1 font-inter-semibold text-[10px]`}
                      >
                        {room.isAvailable ? "Available" : "Unavailble"}
                      </Text>
                    </View>
                    <Text className="font-inter-semibold text-sm">
                      {room.buildingName}
                    </Text>
                    <Text className="font-inter text-sm text-subtext">
                      {room.departmentName}
                    </Text>

                    {/* Facilites */}
                    <View className="mt-2 flex-row items-center gap-x-2">
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
                          ) : null,
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
                  className="absolute right-3 top-3 z-50"
                />

                {activeRoomId === room.id && (
                  <View
                    className="absolute right-6 top-12 z-20 rounded-xl border border-border/30 bg-white"
                    style={styles.shadow}
                  >
                    <TouchableOpacity
                      activeOpacity={0.5}
                      onPress={() => {
                        setActiveRoomId(null);
                        router.push({
                          pathname: "/admin/(tabs)/home/edit-room",
                          params: { id: room.id },
                        });
                      }}
                      className="px-5 pb-2 pt-4"
                    >
                      <Text className="font-inter-medium">Edit room</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.5}
                      onPress={() => {
                        if (!activeRoomId) return;

                        Alert.alert(
                          "Delete Room",
                          `Are you sure you want to delete ${room.name}?`,
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
                          { cancelable: true },
                        );
                      }}
                      className="px-5 pb-4 pt-2"
                    >
                      <Text className="font-inter-medium">Delete room</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </View>
        </AdminHomeLayout>

        {activeRoomId && (
          <TouchableWithoutFeedback onPress={() => setActiveRoomId(null)}>
            <View className="absolute inset-0 z-10 h-screen w-screen" />
          </TouchableWithoutFeedback>
        )}
      </ScrollView>

      <AddButton
        label="Add Room"
        onPress={() => router.push("/admin/(tabs)/home/add-room")}
      />
    </>
  );
};

export default AdminRooms;
