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
        <View className="z-50 inset-0 absolute h-screen w-screen opacity-50">
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
        <View className="px-6 pt-3">
          <View
            className="mb-8 p-5 w-full rounded-xl bg-white"
            style={styles.shadow}
          >
            <View className="flex-row items-center justify-between mb-5">
              <Text className="text-xl font-inter-bold">Report</Text>
              <IonicButton
                icon="ellipsis-horizontal"
                className="absolute right-0"
                size={20}
              />
            </View>

            <View className="flex-row gap-x-5 justify-between items-center">
              <View className="flex-1 items-center">
                <Image
                  source={require("../../../../assets/images/sample/chart1.png")}
                  className="size-36"
                  resizeMode="contain"
                />
              </View>

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

            <View className="mt-7">
              <Text className="font-inter-bold mb-2">
                Percent occupied by hours
              </Text>
              <Image
                source={require("../../../../assets/images/sample/chart2.png")}
                className="size-32 w-full mt-4 rounded-xl"
                resizeMode="cover"
                style={styles.shadow}
              />
            </View>

            <View className="flex-row items-center justify-between border-t border-border mt-5 pt-5">
              <View className="flex-row items-center gap-x-2">
                <Ionicons
                  name="calendar-clear-outline"
                  size={16}
                  color={COLORS.subtext}
                />
                <Text className="font-inter-semibold text-subtext text-sm">
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
              className={`mr-5 rounded-xl min-w-[240px] bg-white flex-row ${
                index === 0 ? "ml-6" : ""
              }`}
              style={styles.shadow}
            >
              <Image
                source={{ uri: room?.image }}
                className={`rounded-l-xl aspect-square`}
                resizeMode="cover"
              />
              <View className="justify-between p-4">
                <View className="flex-row items-center gap-x-3">
                  <Text className="font-inter-bold">{room.name}</Text>
                  <Text className="bg-green/10 text-green self-start px-3 py-1 rounded-full font-inter-semibold text-[10px]">
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
          route={() => router.push("/admin/(tabs)/home/instructors")}
        >
          {instructors.map((instructor, index) => (
            <TouchableOpacity
              key={instructor.id}
              activeOpacity={0.7}
              className={`items-center w-28 mr-2 gap-x-4 ${
                index === 0 ? "ml-6" : ""
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
                className="size-20 rounded-full mb-2"
                resizeMode="contain"
              />
              <Text className="font-inter-bold px-2 text-center">
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
