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
import FilterButton from "@/components/shared/ui/FilterButton";
import { TextInput } from "react-native-gesture-handler";
import SearchInput from "@/components/shared/ui/SearchInput";
import { IMAGES } from "@/constants/images";

type HomeAdminNavigationProp = DrawerNavigationProp<any>;

const HomeAdmin = () => {
  const navigation = useNavigation<HomeAdminNavigationProp>();

  const [searchQuery, setSearchQuery] = useState("");
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

  if (loading) return <Loader />;

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        className="bg-primary/10"
      >
        <View className="h-[32vh] p-5">
          <View className="z-10 mb-6 w-full flex-row items-center gap-x-2">
            <View className="flex-1">
              <SearchInput value={searchQuery} onChangeText={setSearchQuery} />
            </View>

            <IonicButton
              icon="menu"
              size={25}
              onPress={() => navigation.openDrawer()}
              className="rounded-full border border-border bg-white p-3"
            />
          </View>

          <Image
            source={IMAGES.ctuLogo}
            resizeMode="contain"
            className="absolute bottom-[-100px] right-[-100px] size-80 opacity-20"
          />
        </View>

        <View className="rounded-t-[30px] bg-white" style={styles.shadow}>
          <View className="mt-4 h-1.5 w-20 self-center rounded-full bg-border" />

          <View className="mb-6 border-b border-border py-6">
            <ScrollView
              className="px-5"
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              <FilterButton label="Sort by" />
              <FilterButton label="Department" />
              <FilterButton label="Availability" />
              <FilterButton label="Facilites" />
            </ScrollView>
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
                className={`mr-5 min-w-[250px] rounded-xl bg-light ${
                  index === 0 ? "ml-5" : ""
                }`}
                style={styles.shadow}
              >
                <Image
                  source={{ uri: room?.image }}
                  className="h-48 rounded-t-xl"
                  resizeMode="cover"
                />
                <IonicButton
                  icon="arrow-forward-outline"
                  className="absolute right-2 top-2 rounded-full bg-white/40"
                  size={18}
                />
                <View className="justify-between p-3">
                  <View className="flex-row items-center gap-x-3">
                    <Text className="mb-1 font-inter-bold">{room.name}</Text>
                    <Text className="self-start rounded-full bg-green/10 px-3 py-1 font-inter-semibold text-[10px] text-green">
                      Available
                    </Text>
                  </View>
                  <Text className="font-inter-medium text-sm text-subtext">
                    {room.buildingName}
                  </Text>
                  <Text className="font-inter-medium text-sm text-subtext">
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
        </View>
      </ScrollView>
    </>
  );
};

export default HomeAdmin;
