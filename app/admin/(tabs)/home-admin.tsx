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
import { getInstructors } from "@/utils/getInstructors";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/firebase";
import { ActivityIndicator } from "react-native";

const HomeAdmin = () => {
  const { rooms, fetchRooms, addRoom } = useRoomStore();
  const [users, setUsers] = useState<any[]>([]);

  // Add rooms
  const [modalVisible, setModalVisible] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [buildingName, setBuildingName] = useState("");

  // Add instructors
  const [instructorModalVisible, setInstructorModalVisible] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [employeeID, setEmployeeID] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(true);

  const handleAddInstructor = async () => {
    if (!firstName || !lastName || !employeeID || !email || !password) {
      Alert.alert("Missing Fields", "Please fill in all fields.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userData = {
        firstName,
        lastName,
        employeeID: parseInt(employeeID),
        email,
        photoURL:
          "https://res.cloudinary.com/dsbbcevcp/image/upload/v1744735512/user_itndrd.jpg",
        current_room: null,
        is_admin: false,
        createdAt: serverTimestamp(),
      };

      await setDoc(doc(db, "users", user.uid), userData);

      setInstructorModalVisible(false);
      setFirstName("");
      setLastName("");
      setEmployeeID("");
      setEmail("");
      setPassword("");

      fetchUsers(); // Refresh list
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to add instructor.");
    }
  };

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

  const fetchUsers = async () => {
    try {
      const fetchedUsers = await getInstructors();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchUsers(), fetchRooms()]);
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
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <View className="flex-row items-center gap-x-2">
              <Image
                source={require("../../../assets/images/logos/logo-outline-primary.png")}
                className="size-10"
                resizeMode="contain"
              />
              <Text className="font-inter-bold text-xl tracking-tight">
                AuTrack
              </Text>
            </View>
            <Ionicons name="menu" size={30} />
          </View>

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
                <View className="mb-4 p-4 bg-gray-100 rounded-lg">
                  <Text className="font-inter-medium text-base">
                    {item.room_name}
                  </Text>
                  <Text className="text-sm text-gray-600">
                    Building: {item.building}
                  </Text>
                  <Text className="text-sm text-gray-600">
                    Status:{" "}
                    {item.is_available
                      ? "Available"
                      : `Occupied by ${item.current_occupant}`}
                  </Text>
                </View>
              )}
            />
          </View>

          {/* Instructors */}
          <View>
            <View className="flex-row items-center justify-between">
              <Text className="font-inter-bold text-lg mt-6 mb-4">
                Instructors
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                className="bg-blue px-5 py-2 rounded-lg"
                onPress={() => setInstructorModalVisible(true)}
              >
                <Text className="text-white font-inter-semibold text-sm">
                  Add Instructor
                </Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={users}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View className="mb-4 p-4 bg-light rounded-lg">
                  <Text className="font-inter-medium text-base">
                    {item.firstName} {item.lastName}
                  </Text>
                  <Text className="text-sm text-gray-600">{item.email}</Text>
                </View>
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

          <Modal
            visible={instructorModalVisible}
            animationType="fade"
            transparent={true}
            onRequestClose={() => setInstructorModalVisible(false)}
          >
            <View className="flex-1 justify-center items-center bg-black/40">
              <View className="bg-white w-11/12 rounded-xl p-6">
                <Text className="font-inter-bold text-lg mb-4">
                  Add Instructor
                </Text>

                <TextInput
                  placeholder="First Name"
                  value={firstName}
                  onChangeText={setFirstName}
                  className="border border-gray-300 rounded-md p-3 mb-3"
                />
                <TextInput
                  placeholder="Last Name"
                  value={lastName}
                  onChangeText={setLastName}
                  className="border border-gray-300 rounded-md p-3 mb-3"
                />
                <TextInput
                  placeholder="Employee ID"
                  value={employeeID}
                  onChangeText={setEmployeeID}
                  keyboardType="numeric"
                  className="border border-gray-300 rounded-md p-3 mb-3"
                />
                <TextInput
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="border border-gray-300 rounded-md p-3 mb-3"
                />
                <TextInput
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  className="border border-gray-300 rounded-md p-3 mb-5"
                />

                <View className="flex-row justify-end gap-x-3">
                  <TouchableOpacity
                    className="px-4 py-2 bg-gray-200 rounded-lg"
                    onPress={() => setInstructorModalVisible(false)}
                  >
                    <Text className="text-gray-700 font-inter-semibold">
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="px-4 py-2 bg-blue rounded-lg"
                    onPress={handleAddInstructor}
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
