import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Image,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import { router } from "expo-router";
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
import FilterButton from "@/components/shared/ui/FilterButton";
import Modal from "react-native-modal";
import SortButton from "@/components/shared/ui/SortButton";
import useDepartmentStore from "@/store/useDepartmentStore";
import FormButton from "@/components/shared/ui/FormButton";

type Facilities = {
  airConditioned: boolean;
  blackboard: boolean;
  tv: boolean;
  wifi: boolean;
  projector: boolean;
};

const AdminRooms = () => {
  const {
    fetchRooms,
    deleteRoom,
    loading,
    getSortedRooms,
    setSortOption,
    sortOption,
    departmentFilters,
    setDepartmentFilters,
  } = useRoomStore();
  const { departments, fetchDepartments } = useDepartmentStore();
  const filteredRooms = getSortedRooms();
  const [refreshing, setRefreshing] = useState(false);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [showSortModal, setShowSortModal] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

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

  useEffect(() => {
    fetchDepartments?.();
    fetchRooms?.();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setDepartmentFilters([]);
    setSortOption("default");
    await fetchRooms?.();
    setRefreshing(false);
  }, [fetchRooms]);

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
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        <AdminHomeLayout>
          <View className="mb-6 flex-row">
            <FilterButton
              onPress={() => setShowFilter(true)}
              label="Departments"
              number={departmentFilters.length}
              active={departmentFilters.length > 0}
            />
            <FilterButton
              onPress={() => setShowSortModal(true)}
              label={`Sort by: ${sortOption}`}
              active={sortOption !== "default"}
            />
          </View>

          {departmentFilters.length > 0 && (
            <View className="mb-6 flex-row flex-wrap items-center gap-3">
              {departmentFilters.length > 0 && [
                ...departmentFilters.map((id) => {
                  const dept = departments.find((d) => d.id === id);
                  if (!dept) return null;
                  return (
                    <View
                      key={id}
                      className="rounded-full bg-primary/10 px-3 py-1"
                    >
                      <Text className="font-inter-medium text-xs text-primary">
                        {dept.name}
                      </Text>
                    </View>
                  );
                }),
                <TouchableOpacity
                  key="clear-all"
                  onPress={() => setDepartmentFilters([])}
                >
                  <Text className="border-b font-inter-medium text-sm">
                    Clear All
                  </Text>
                </TouchableOpacity>,
              ]}
            </View>
          )}

          <View>
            {filteredRooms.map((room) => (
              <View key={room.id} className="relative mb-6">
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() =>
                    router.push({
                      pathname: "/admin/(tabs)/home/room-details",
                      params: { id: room.id },
                    })
                  }
                  className="w-full flex-row rounded-xl bg-light"
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

      {/* FILTER MODAL */}
      <Modal
        isVisible={showFilter}
        onBackButtonPress={() => setShowFilter(false)}
        onBackdropPress={() => setShowFilter(false)}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropOpacity={0.5}
        statusBarTranslucent
        style={{
          justifyContent: "flex-end",
          margin: 0,
        }}
      >
        <View className="rounded-t-3xl bg-white px-5 py-8">
          <View className="mb-5 flex-row items-center justify-between">
            <Text className="font-inter-bold text-xl">Filter by</Text>
            {departmentFilters.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  setDepartmentFilters([]);
                  setShowFilter(false);
                }}
              >
                <Text className="border-b font-inter-medium">Clear All</Text>
              </TouchableOpacity>
            )}
          </View>

          <Text className="mb-2 font-inter-semibold text-lg">Departments</Text>

          {/* List of departments with multi-select */}
          {departments.map((department) => (
            <TouchableOpacity
              key={department.id}
              activeOpacity={0.7}
              onPress={() => {
                const isSelected = departmentFilters.includes(department.id);
                if (isSelected) {
                  // Remove from filters
                  setDepartmentFilters(
                    departmentFilters.filter((id) => id !== department.id),
                  );
                } else {
                  // Add to filters
                  setDepartmentFilters([...departmentFilters, department.id]);
                }
              }}
              className="flex-row items-center justify-between rounded-lg py-4"
            >
              <Text
                className={`font-inter-medium ${departmentFilters.includes(department.id) ? "text-black" : "text-subtext"}`}
              >
                {department.name}
              </Text>

              <Ionicons
                name="ellipse"
                className={`${departmentFilters.includes(department.id) ? "border-primary" : "border-border"} rounded-full border p-[2px]`}
                color={
                  departmentFilters.includes(department.id)
                    ? COLORS.primary
                    : COLORS.white
                }
              />
            </TouchableOpacity>
          ))}

          <View className="mt-1 border-t border-border pt-5">
            <FormButton
              label="Apply Filters"
              onPress={() => setShowFilter(false)}
            />
          </View>
        </View>
      </Modal>

      {/* SORT MODAL */}
      <Modal
        isVisible={showSortModal}
        onBackButtonPress={() => setShowSortModal(false)}
        onBackdropPress={() => setShowSortModal(false)}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropOpacity={0.5}
        statusBarTranslucent
        style={{
          justifyContent: "flex-end",
          margin: 0,
        }}
      >
        <View className="rounded-t-3xl bg-white px-5 py-8">
          <Text className="mb-2 font-inter-bold text-xl">Sort by</Text>

          <View>
            <SortButton
              label="Default"
              value="default"
              currentSortOption={sortOption}
              onPress={() => {
                setShowSortModal(false);
                setSortOption("default");
              }}
            />

            <SortButton
              label="Date (oldest to latest)"
              value="date_asc"
              currentSortOption={sortOption}
              onPress={() => {
                setShowSortModal(false);
                setSortOption("date_asc");
              }}
            />

            <SortButton
              label="Date (newest to oldest)"
              value="date_desc"
              currentSortOption={sortOption}
              onPress={() => {
                setShowSortModal(false);
                setSortOption("date_desc");
              }}
            />

            <SortButton
              label="Name (A-Z)"
              value="name_asc"
              currentSortOption={sortOption}
              onPress={() => {
                setShowSortModal(false);
                setSortOption("name_asc");
              }}
            />

            <SortButton
              label="Name (Z-A)"
              value="name_desc"
              currentSortOption={sortOption}
              onPress={() => {
                setShowSortModal(false);
                setSortOption("name_desc");
              }}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

export default AdminRooms;
