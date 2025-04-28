import React, { useEffect, useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Image,
} from "react-native";
import useRoomStore from "@/store/useRoomStore";
import Modal from "react-native-modal";
import { SafeAreaView } from "react-native-safe-area-context";
import InputContainer from "./InputContainer";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";
import useDepartmentStore from "@/store/useDepartmentStore";

interface AddRoomModalProps {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
}

const AddRoomModal = ({ showModal, setShowModal }: AddRoomModalProps) => {
  const { addRoom } = useRoomStore();
  const { departments, fetchDepartments } = useDepartmentStore();

  const [roomName, setRoomName] = useState("");
  const [buildingName, setBuildingName] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (showModal) {
      fetchDepartments();
    }
  }, [showModal]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImageToCloudinary = async (imageUri: string) => {
    const formData = new FormData();
    formData.append("file", {
      uri: imageUri,
      type: "image/jpeg",
      name: `room_${Date.now()}.jpg`,
    } as any);
    formData.append("upload_preset", "autrack");
    formData.append("cloud_name", "dsbbcevcp");
    formData.append("folder", "rooms");

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dsbbcevcp/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    return data.secure_url as string;
  };

  const handleAddRoom = async () => {
    if (!roomName || !buildingName || !image || !selectedDepartmentId) {
      Alert.alert(
        "Missing Fields",
        "Please fill in all fields, select a department, and upload an image."
      );
      return;
    }

    try {
      setUploading(true);
      const imageURL = await uploadImageToCloudinary(image);
      await addRoom(roomName, buildingName, imageURL, selectedDepartmentId); // ✅ pass selectedDepartmentId
      setShowModal(false);
      setRoomName("");
      setBuildingName("");
      setImage(null);
      setSelectedDepartmentId("");
    } catch (error) {
      Alert.alert("Error", "Failed to add room.");
    } finally {
      setUploading(false);
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
      <SafeAreaView className="flex-1 bg-black/50 px-8 justify-center items-center">
        <View className="bg-white p-6 w-full rounded-xl">
          <Text className="font-inter-bold text-lg mb-6">Add New Room</Text>

          <View className="gap-y-4 mb-6">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={pickImage}
              className="relative"
            >
              {!image ? (
                <View className="h-52 border border-dashed rounded-md border-border justify-center items-center bg-gray-100">
                  <Ionicons
                    name="images-outline"
                    size={30}
                    color={COLORS.subtext}
                  />
                  <Text className="mt-3 text-subtext font-inter-medium text-sm ">
                    Choose an image
                  </Text>
                </View>
              ) : (
                <>
                  <Image
                    source={{ uri: image }}
                    className="w-full h-52 rounded-lg"
                  />
                  <Text className="absolute bottom-3 right-3 bg-white text-sm px-5 py-3 rounded-lg shadow font-inter-semibold">
                    Change Image
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <InputContainer title="Room Name">
              <TextInput
                placeholder="Room Name"
                value={roomName}
                onChangeText={setRoomName}
                className="border border-border rounded-md px-4 py-4 font-inter-medium"
              />
            </InputContainer>

            <InputContainer title="Building Name">
              <TextInput
                placeholder="Building Name"
                value={buildingName}
                onChangeText={setBuildingName}
                className="border border-border rounded-md p-4 font-inter-medium"
              />
            </InputContainer>

            <InputContainer title="Department">
              <View className="border border-border rounded-md mb-5">
                <Picker
                  selectedValue={selectedDepartmentId}
                  onValueChange={(itemValue) =>
                    setSelectedDepartmentId(itemValue)
                  }
                >
                  <Picker.Item label="Select Department" value="" />
                  {departments.map((dept) => (
                    <Picker.Item
                      key={dept.id}
                      label={dept.name}
                      value={dept.id}
                    />
                  ))}
                </Picker>
              </View>
            </InputContainer>
          </View>

          <View className="flex-row justify-between gap-x-4">
            <TouchableOpacity
              activeOpacity={0.7}
              className={`${
                uploading && "opacity-50"
              } p-4 rounded-lg flex-1 border border-border items-center justify-center`}
              onPress={() => setShowModal(false)}
              disabled={uploading}
            >
              <Text className="font-inter-semibold">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              className={`${
                uploading && "opacity-50"
              } px-4 py-2 bg-blue rounded-lg flex-1 items-center justify-center`}
              onPress={handleAddRoom}
              disabled={uploading}
            >
              <Text className="text-white font-inter-semibold">
                {uploading ? "Adding..." : "Add Room"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default AddRoomModal;
