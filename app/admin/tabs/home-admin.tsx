import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import useRoomStore from "@/store/useRoomStore";
import { ActivityIndicator } from "react-native";
import { router } from "expo-router";

const HomeAdmin = () => {
  const { rooms, fetchRooms, addRoom } = useRoomStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [buildingName, setBuildingName] = useState("");
  const [loading, setLoading] = useState(true);

  const handleAddRoom = async () => {
    if (!roomName || !buildingName) {
      Alert.alert("Missing Fields", "Please fill in all fields.");
      return;
    }

    try {
      await addRoom(roomName, buildingName);
      setModalVisible(false);
      setRoomName("");
      setBuildingName("");
    } catch (error) {
      Alert.alert("Error", "Failed to add room.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchRooms()]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <View className="bg-white flex-1 p-8">
      {loading ? (
        <View className="flex-1 bg-white justify-center items-center">
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      ) : (
        <>
          {/* Rooms */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between">
              <Text className="font-inter-bold text-lg mt-6 mb-4">Rooms</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                className="bg-blue px-5 py-2 rounded-lg"
                onPress={() => setModalVisible(true)}
              >
                <Text className="text-white font-inter-semibold text-sm">
                  Add Room
                </Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={rooms}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/admin/rooms/room",
                      params: { id: item.id },
                    })
                  }
                  className="mb-4 p-4 bg-gray-100 rounded-lg"
                >
                  <Text className="font-inter-medium text-base">
                    {item.room_name}
                  </Text>
                  <Text className="text-sm text-gray-600">
                    Building: {item.building}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>

          {/* Modal for Adding Room */}
          <Modal
            visible={modalVisible}
            animationType="fade"
            transparent={true}
            onRequestClose={() => setModalVisible(false)}
          >
            <View className="flex-1 justify-center items-center bg-black/40">
              <View className="bg-white w-11/12 rounded-xl p-6">
                <Text className="font-inter-bold text-lg mb-4">
                  Add New Room
                </Text>

                <TextInput
                  placeholder="Room Name"
                  value={roomName}
                  onChangeText={setRoomName}
                  className="border border-gray-300 rounded-md p-3 mb-3"
                />

                <TextInput
                  placeholder="Building Name"
                  value={buildingName}
                  onChangeText={setBuildingName}
                  className="border border-gray-300 rounded-md p-3 mb-5"
                />

                <View className="flex-row justify-end gap-x-3">
                  <TouchableOpacity
                    className="px-4 py-2 bg-gray-200 rounded-lg"
                    onPress={() => setModalVisible(false)}
                  >
                    <Text className="text-gray-700 font-inter-semibold">
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="px-4 py-2 bg-blue rounded-lg"
                    onPress={handleAddRoom}
                  >
                    <Text className="text-white font-inter-semibold">Add</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </>
      )}
    </View>
  );
};

export default HomeAdmin;
