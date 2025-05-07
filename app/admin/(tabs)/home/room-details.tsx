import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  Alert,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import useRoomStore from "@/store/useRoomStore";
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import AddScheduleModal from "@/components/admin/feedback/AddScheduleModal";
import Loader from "@/components/shared/ui/Loader";
import IonicButton from "@/components/shared/ui/IonicButton";
import { styles } from "@/styles/styles";
import { COLORS } from "@/constants/colors";
import HeaderBack from "@/components/shared/header/HeaderBack";
import AddButton from "@/components/admin/ui/AddButton";
import useScheduleStore from "@/store/useScheduleStore";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const TIMES = Array.from({ length: 30 }, (_, i) => {
  const hour = Math.floor(i / 2) + 7;
  const minute = i % 2 === 0 ? "00" : "30";
  const formatHour = (h: number) => h.toString().padStart(2, "0");
  return `${formatHour(hour)}:${minute}`;
});

const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

type Facilities = {
  airConditioned: boolean;
  blackboard: boolean;
  tv: boolean;
  wifi: boolean;
  projector: boolean;
};

const AdminRoomDetails = () => {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { currentRoom, fetchRoom, deleteRoom } = useRoomStore();
  const { schedules, fetchSchedulesForRoom } = useScheduleStore();

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [showActions, setShowActions] = useState(false);

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
      size: 11,
    },
    { key: "tv", icon: "tv", library: FontAwesome5, size: 11 },
    { key: "wifi", icon: "wifi", library: FontAwesome5, size: 11 },
    { key: "blackboard", icon: "chalkboard", library: FontAwesome5, size: 11 },
    {
      key: "projector",
      icon: "projector-screen-outline",
      library: MaterialCommunityIcons,
      size: 13,
    },
  ];

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchRoom(id), fetchSchedulesForRoom(id)]);
    setRefreshing(false);
  };

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
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="bg-white"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        {currentRoom && (
          <View className="">
            <View>
              <Image
                source={{ uri: currentRoom?.image }}
                className={`aspect-video`}
                resizeMode="cover"
              />

              <View className="absolute left-5 top-5 rounded-full bg-light/50">
                <HeaderBack />
              </View>
            </View>

            <View className="gap-y-1 px-5 py-6">
              <IonicButton
                onPress={() => setShowActions(showActions ? false : true)}
                icon="ellipsis-vertical"
                size={20}
                className="absolute right-3 top-3 z-50"
              />

              {showActions && (
                <View
                  className="absolute right-7 top-12 z-20 rounded-xl border border-border/30 bg-white"
                  style={styles.shadow}
                >
                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => {
                      setShowActions(false);
                      router.push({
                        pathname: "/admin/(tabs)/home/edit-room",
                        params: { id: currentRoom.id },
                      });
                    }}
                    className="px-5 pb-2 pt-4"
                  >
                    <Text className="font-inter-medium">Edit room</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => {
                      Alert.alert(
                        "Delete Room",
                        `Are you sure you want to delete ${currentRoom.name}?`,
                        [
                          {
                            text: "Cancel",
                            style: "cancel",
                          },
                          {
                            text: "Delete",
                            onPress: async () => {
                              setShowActions(false);
                              await deleteRoom(currentRoom.id);
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

              {/* Details */}
              <View className="flex-row items-center gap-x-4">
                <Text className="font-inter-bold text-2xl">
                  {currentRoom.name}
                </Text>
                <Text className="self-start rounded-full bg-green/10 px-3 py-1 font-inter-semibold text-xs text-green">
                  Available
                </Text>
              </View>
              <Text className="font-inter">
                Building: {currentRoom.buildingName}
              </Text>
              <Text className="font-inter">
                Department: {currentRoom.departmentName}
              </Text>
              <Text className="font-inter">
                Capacity: {currentRoom.capacity}
              </Text>

              <View className="flex-row items-center gap-x-2">
                <Text className="font-inter">Facilities:</Text>
                {facilityIcons.map(
                  ({ key, icon, library: IconComponent, size }) =>
                    currentRoom.facilities?.[key] ? (
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
          </View>
        )}

        {/* Timeable */}
        <View className="flex-row">
          {/* Time Column */}
          <View className="border-r border-border bg-gray-100">
            <View className="items-center justify-center px-5 py-2">
              <Text className="font-inter-semibold text-subtext">Time</Text>
            </View>

            {TIMES.map((time) => (
              <View
                className="items-center justify-center px-5"
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
                  <View className="items-center justify-center bg-blue px-10 py-2">
                    <Text className="font-inter-bold text-white">
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
                          matchingSchedule.startTime,
                        );
                        const scheduleEnd = timeToMinutes(
                          matchingSchedule.endTime,
                        );
                        const durationMinutes = scheduleEnd - scheduleStart;
                        const blockHeight = (durationMinutes / 30) * 30;

                        const rowsToSpan = durationMinutes / 30;
                        skipCount = rowsToSpan - 1;

                        // Schedule block
                        cells.push(
                          <View
                            key={`${dayIndex}-${i}`}
                            className="w-40 items-center justify-center border-l-4 border-r border-l-blue border-r-border bg-blue/10"
                            style={{
                              height: blockHeight,
                            }}
                          >
                            <Text className="mb-2 text-center font-inter-semibold leading-relaxed">
                              {matchingSchedule.instructorName}
                            </Text>
                            <Text className="text-center font-inter text-sm text-subtext">
                              {matchingSchedule.startTime} -{" "}
                              {matchingSchedule.endTime}
                            </Text>
                          </View>,
                        );
                      } else if (
                        currentTime === "12:00" ||
                        currentTime === "12:30"
                      ) {
                        cells.push(
                          <View
                            key={`${dayIndex}-${i}`}
                            className="w-40 items-center justify-center border-r border-gray-200 bg-gray-200"
                            style={{ height: 30 }}
                          >
                            <Text className="font-inter text-xs text-yellow-700"></Text>
                          </View>,
                        );
                      } else {
                        cells.push(
                          <View
                            className="w-40 border-r border-border"
                            key={`${dayIndex}-${i}`}
                            style={{ height: 30 }}
                          />,
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

      <AddButton label="Add Schedule" onPress={() => setShowModal(true)} />

      <AddScheduleModal
        roomId={currentRoom?.id}
        showModal={showModal}
        setShowModal={setShowModal}
      />
    </>
  );
};

export default AdminRoomDetails;
