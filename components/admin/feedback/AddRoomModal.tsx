// components/admin/AddRoomModal.tsx
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import useRoomStore from "@/store/useRoomStore";
import Modal from "react-native-modal";

interface AddRoomModalProps {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
}

const AddRoomModal = ({ showModal, setShowModal }: AddRoomModalProps) => {
  const { addRoom } = useRoomStore();
  const [roomName, setRoomName] = useState("");
  const [buildingName, setBuildingName] = useState("");

  const handleAddRoom = async () => {
    if (!roomName || !buildingName) {
      Alert.alert("Missing Fields", "Please fill in all fields.");
      return;
    }

    try {
      await addRoom(roomName, buildingName);
      setShowModal(false);
      setRoomName("");
      setBuildingName("");
    } catch (error) {
      Alert.alert("Error", "Failed to add room.");
    }
  };

  return (
    <Modal
      isVisible={showModal}
      onBackButtonPress={() => setShowModal(false)}
      onBackdropPress={() => setShowModal(false)}
      animationIn="fadeIn"
      animationOut="fadeOut"
      backdropOpacity={0}
      statusBarTranslucent
      style={{ margin: 0 }}
    >
      {/* main container - background */}
      <View className="flex-1 justify-center items-center bg-black/40">
        {/* modal content - white background */}
        <View className="bg-white w-11/12 rounded-xl p-6">
          <Text className="font-inter-bold text-lg mb-4">Add New Room</Text>

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
              onPress={() => setShowModal(false)}
            >
              <Text className="text-gray-700 font-inter-semibold">Cancel</Text>
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
  );
};

export default AddRoomModal;
