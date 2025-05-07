import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  RefreshControl,
} from "react-native";
import React, {
  useEffect,
  useState,
  useCallback,
  useLayoutEffect,
} from "react";
import { router } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import useRoomStore from "@/store/useRoomStore";
import { useInstructorStore } from "@/store/useInstructorStore";
import IonicButton from "@/components/shared/ui/IonicButton";
import CardContainer from "@/components/admin/layouts/CardContainer";
import Loader from "@/components/shared/ui/Loader";
import { styles } from "@/styles/styles";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";
import { getCurrentDate } from "@/utils/getCurrentDate";

type HomeAdminNavigationProp = DrawerNavigationProp<any>;

const HomeAdmin = () => {
  const navigation = useNavigation<HomeAdminNavigationProp>();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { rooms, fetchRooms } = useRoomStore();
  const { instructors, fetchInstructors } = useInstructorStore();

  const fetchAllData = async () => {
    try {
      await Promise.all([fetchRooms(), fetchInstructors()]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const initialLoad = async () => {
      setLoading(true);
      await fetchAllData();
      setLoading(false);
    };

    initialLoad();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAllData();
    setRefreshing(false);
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IonicButton
          icon="menu"
          size={28}
          onPress={() => navigation.openDrawer()}
        />
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
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        className="flex-1 bg-white"
      >
        {/* Dashboard Card */}
        <View className="px-5 pt-3">
          <View
            className="mb-6 w-full rounded-xl bg-white p-5"
            style={styles.shadow}
          >
            <View className="mb-5 flex-row items-center justify-between">
              <Text className="font-inter-bold text-xl">Analytics</Text>
              <IonicButton
                icon="ellipsis-horizontal"
                className="absolute right-0"
                size={20}
              />
            </View>

            <View className="flex-row items-center justify-between gap-x-5">
              <Image
                source={require("../../../../assets/images/sample/chart1.png")}
                className="size-36 flex-1"
                resizeMode="contain"
              />

              <View className="flex-1">
                <Text className="font-inter-bold">Room Availabilty</Text>

                <View className="mt-4 gap-y-2">
                  <View className="flex-row items-center gap-x-2">
                    <Ionicons name="ellipse" size={10} color={COLORS.green} />
                    <Text className="font-inter-medium text-green">
                      3 Available
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-x-2">
                    <Ionicons name="ellipse" size={10} color={COLORS.red} />
                    <Text className="font-inter-medium text-red">
                      10 Unavailable
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-x-2">
                    <Ionicons name="ellipse" size={10} color={COLORS.yellow} />
                    <Text className="font-inter-medium text-yellow-500">
                      5 Pending
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <Image
              source={require("../../../../assets/images/sample/chart2.png")}
              className="mb-4 size-32 w-full rounded-xl"
              resizeMode="stretch"
            />

            <View className="flex-row items-center justify-between border-t border-border pt-4">
              <View className="flex-row items-center gap-x-2">
                <Ionicons
                  name="calendar-clear-outline"
                  size={16}
                  color={COLORS.subtext}
                />
                <Text className="font-inter-semibold text-sm text-subtext">
                  {getCurrentDate()}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => router.push("/admin/dashboard")}
                className="mr-[-8px] flex-row items-center gap-x-2"
              >
                <Text className="font-inter-bold text-blue">More</Text>
                <Ionicons
                  name="chevron-forward"
                  size={15}
                  color={COLORS.subtext}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Rooms */}
        <CardContainer
          title="Rooms"
          route={() => router.push("/admin/(tabs)/home/rooms")}
        >
          {rooms.map((room, index) => (
            <TouchableOpacity
              key={room.id}
              activeOpacity={0.7}
              onPress={() =>
                router.push({
                  pathname: "/admin/(tabs)/home/room-details",
                  params: { id: room.id },
                })
              }
              className={`mr-5 min-w-[240px] flex-row rounded-xl bg-white ${
                index === 0 ? "ml-5" : ""
              }`}
              style={styles.shadow}
            >
              <Image
                source={{ uri: room?.image }}
                className={`aspect-square rounded-l-xl`}
                resizeMode="cover"
              />
              <View className="justify-between gap-y-1 p-4">
                <View className="flex-row items-center gap-x-3">
                  <Text className="font-inter-bold">{room.name}</Text>
                  <Text className="self-start rounded-full bg-green/10 px-3 py-1 font-inter-semibold text-[10px] text-green">
                    Available
                  </Text>
                </View>
                <Text className="font-inter text-sm text-subtext">
                  {room.buildingName}
                </Text>
                <Text className="font-inter text-sm text-subtext">
                  {room.departmentName}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </CardContainer>

        {/* Instructors */}
        <CardContainer
          title="Instructors"
          route={() => router.push("/admin/(tabs)/home/instructors")}
        >
          {instructors.map((instructor, index) => (
            <TouchableOpacity
              key={instructor.id}
              activeOpacity={0.7}
              className={`mr-2 w-28 items-center gap-x-4 ${
                index === 0 ? "ml-5" : ""
              }`}
              onPress={() =>
                router.push({
                  pathname: "/admin/(tabs)/home/instructor-details",
                  params: { id: instructor.id },
                })
              }
            >
              <Image
                source={{ uri: instructor?.image }}
                className="mb-2 size-20 rounded-full bg-white"
                resizeMode="contain"
                style={styles.shadow}
              />
              <Text className="px-2 text-center font-inter-bold leading-relaxed">
                {instructor.firstName} {instructor.lastName}
              </Text>
            </TouchableOpacity>
          ))}
        </CardContainer>
      </ScrollView>
    </>
  );
};

export default HomeAdmin;
