import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  RefreshControl,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import useUserStore from "@/store/useUserStore";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { styles } from "@/styles/styles";
import SearchInput from "@/components/shared/ui/SearchInput";
import { IMAGES } from "@/constants/images";
import { Ionicons } from "@expo/vector-icons";
import FilterButton from "@/components/shared/ui/FilterButton";
import useRoomStore from "@/store/useRoomStore";
import IonicButton from "@/components/shared/ui/IonicButton";
import { COLORS } from "@/constants/colors";
import Modal from "react-native-modal";
import FormButton from "@/components/shared/ui/FormButton";

type Room = {
  id: string;
  image: string;
  name: string;
  buildingName: string;
  departmentName: string;
};

const Home = () => {
  const { user } = useUserStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const { rooms, fetchRooms } = useRoomStore();

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchRooms?.();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchRooms?.();
    setRefreshing(false);
  }, []);

  const openModal = (room: Room) => {
    setSelectedRoom(room);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedRoom(null);
    setModalVisible(false);
  };

  return (
    <>
      <SafeAreaView className="flex-1">
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
          <View className="items-center justify-between gap-y-7 px-5 pb-8 pt-5">
            <SearchInput value={searchQuery} onChangeText={setSearchQuery} />

            <View
              className="z-10 h-[20vh] w-[60%] rounded-full bg-white"
              style={styles.shadow}
            />

            <View className="z-10 items-center">
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                  router.push({
                    pathname: "/instructor/(tabs)/home/schedule",
                    params: { id: user?.id },
                  })
                }
                className="flex-row items-center gap-x-2 rounded-full bg-blue px-6 py-3"
              >
                <Text className="font-inter-bold text-white">
                  View Class Shedule
                </Text>
                <Ionicons name="arrow-forward" size={18} color="white" />
              </TouchableOpacity>
            </View>

            <Image
              source={IMAGES.ctuLogo}
              resizeMode="contain"
              className="absolute bottom-[-100px] right-[-100px] size-80 opacity-20"
            />
          </View>

          <View
            className="flex-1 rounded-t-[30px] bg-white"
            style={styles.shadow}
          >
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
            <View className="px-5">
              <Text className="mb-4 font-inter-bold text-2xl">
                Request Room
              </Text>
              {rooms.map((room) => (
                <TouchableOpacity
                  key={room.id}
                  activeOpacity={0.7}
                  // onPress={() => openModal(room)}
                  onPress={() =>
                    router.push("/instructor/(tabs)/home/room-schedule")
                  }
                  className="mb-5 flex-row rounded-xl bg-light"
                  style={styles.shadow}
                >
                  <Image
                    source={{ uri: room?.image }}
                    className="aspect-square rounded-l-xl"
                    resizeMode="cover"
                  />
                  <IonicButton
                    icon="scan"
                    className="absolute right-2 top-2 rounded-full"
                    size={24}
                  />
                  <View className="justify-between p-3">
                    <View className="flex-row items-center gap-x-3">
                      <Text className="mb-2 font-inter-bold">{room.name}</Text>
                      <Text className="self-start rounded-full bg-green/10 px-3 py-1 font-inter-semibold text-[10px] text-green">
                        Available
                      </Text>
                    </View>
                    <Text className="mb-1 font-inter-medium text-sm text-subtext">
                      {room.buildingName}
                    </Text>
                    <Text className="font-inter-medium text-sm text-subtext">
                      {room.departmentName}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      <Modal
        isVisible={isModalVisible}
        onBackButtonPress={closeModal}
        onBackdropPress={closeModal}
        backdropOpacity={0.5}
        statusBarTranslucent
        style={{ justifyContent: "flex-end", margin: 0 }}
      >
        <View className="rounded-t-3xl bg-white">
          {selectedRoom && (
            <>
              <Image
                source={{ uri: selectedRoom.image }}
                className="aspect-video rounded-t-3xl"
                resizeMode="cover"
              />

              <IonicButton
                onPress={closeModal}
                icon="close"
                className="absolute right-5 top-5 rounded-full bg-white/40 p-2"
                size={24}
              />

              <View className="p-5">
                <Text className="mb-2 font-inter-bold text-lg">
                  {selectedRoom.name}
                </Text>
                <Text className="mb-1 font-inter-medium text-subtext">
                  {selectedRoom.buildingName}
                </Text>
                <Text className="font-inter-medium text-subtext">
                  {selectedRoom.departmentName}
                </Text>

                <View className="pt-5">
                  <FormButton label="Request Room" />
                </View>
              </View>
            </>
          )}
        </View>
      </Modal>
    </>
  );
};

export default Home;
