import React, { useEffect, useMemo, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";
import useDepartmentStore from "@/store/useDepartmentStore";
import useBuildingStore from "@/store/useBuildingStore";
import useRoomStore from "@/store/useRoomStore";
import { useLocalSearchParams, router } from "expo-router";
import InputField from "@/components/shared/ui/InputField";
import PickerField from "@/components/shared/ui/PickerField";
import Loader from "@/components/shared/ui/Loader";
import { uploadImage } from "@/utils/uploadImage";
import FormButton from "@/components/shared/ui/FormButton";

const EditRoom = () => {
  const { id } = useLocalSearchParams();
  const { fetchRoom, currentRoom, updateRoom } = useRoomStore();
  const { departments, fetchDepartments } = useDepartmentStore();
  const { buildings, fetchBuildings } = useBuildingStore();

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [capacity, setCapacity] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [selectedBuildingId, setSelectedBuildingId] = useState("");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
  const [facilities, setFacilities] = useState({
    airConditioned: false,
    blackboard: false,
    tv: false,
    wifi: false,
    projector: false,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const isUnchanged = useMemo(() => {
    if (!currentRoom) return true;

    const currentFacilities = currentRoom.facilities ?? {
      airConditioned: false,
      blackboard: false,
      tv: false,
      wifi: false,
      projector: false,
    };

    const facilitiesUnchanged = Object.keys(facilities).every(
      (key) =>
        facilities[key as keyof typeof facilities] ===
        currentFacilities[key as keyof typeof facilities]
    );

    return (
      name === currentRoom.name &&
      code === currentRoom.code &&
      capacity === currentRoom.capacity.toString() &&
      image === (currentRoom.image || null) &&
      selectedBuildingId === currentRoom.buildingId &&
      selectedDepartmentId === currentRoom.departmentId &&
      facilitiesUnchanged
    );
  }, [
    name,
    code,
    capacity,
    image,
    selectedBuildingId,
    selectedDepartmentId,
    facilities,
    currentRoom,
  ]);

  useEffect(() => {
    const fetchingData = async () => {
      setFetching(true);
      try {
        await Promise.all([
          fetchDepartments(),
          fetchBuildings(),
          fetchRoom(id as string),
        ]);
      } catch (error) {
        Alert.alert("Error", "Failed to fetch room data.");
      } finally {
        setFetching(false);
      }
    };

    fetchingData();
  }, [id]);

  useEffect(() => {
    if (currentRoom) {
      setName(currentRoom.name);
      setCode(currentRoom.code);
      setCapacity(currentRoom.capacity.toString());
      setImage(currentRoom.image);
      setSelectedBuildingId(currentRoom.buildingId);
      setSelectedDepartmentId(currentRoom.departmentId);
      setFacilities(
        currentRoom.facilities ?? {
          airConditioned: false,
          blackboard: false,
          tv: false,
          wifi: false,
          projector: false,
        }
      );
    }
  }, [currentRoom]);

  const toggleFacility = (key: keyof typeof facilities) => {
    setFacilities((prev) => ({ ...prev, [key]: !prev[key] }));
  };

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

  const handleEditRoom = async () => {
    if (
      !name ||
      !code ||
      !capacity ||
      !selectedBuildingId ||
      !selectedDepartmentId
    ) {
      setError("Please fill out all the fields.");
      return;
    }

    try {
      setLoading(true);
      let imageURL = image;

      if (image && !image.startsWith("https://"))
        await uploadImage(image, {
          uploadPreset: "autrack-rooms",
          cloudName: "dsbbcevcp",
        });

      await updateRoom(id as string, {
        name,
        image: imageURL!,
        buildingId: selectedBuildingId,
        departmentId: selectedDepartmentId,
        code,
        capacity: parseInt(capacity),
        facilities,
      });

      Alert.alert("Success", "Room updated successfully.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to update room.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <Loader />;

  return (
    <SafeAreaView className="flex-1 bg-white px-6">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="gap-y-6 pb-6">
          {error && (
            <View className="bg-red/10 rounded-full py-4 px-5">
              <Text className="text-sm text-red font-inter-medium">
                {error}
              </Text>
            </View>
          )}

          <TouchableOpacity activeOpacity={0.7} onPress={pickImage}>
            {!image ? (
              <View className="h-60 border border-dashed rounded-xl border-border justify-center items-center bg-gray-100">
                <Ionicons
                  name="images-outline"
                  size={30}
                  color={COLORS.subtext}
                />
                <Text className="mt-3 text-subtext font-inter-medium text-sm">
                  Choose an image
                </Text>
              </View>
            ) : (
              <>
                <Image
                  source={{ uri: image }}
                  className="w-full h-60 rounded-xl"
                />
                <View className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center">
                  <Ionicons
                    name="images-outline"
                    size={30}
                    color={COLORS.white}
                  />
                  <Text className="mt-3 text-white font-inter-medium text-sm">
                    Change image
                  </Text>
                </View>
              </>
            )}
          </TouchableOpacity>

          <InputField
            label="Room Name"
            value={name}
            onChangeText={setName}
            error={!name && !!error}
          />
          <View className="flex-row gap-x-5">
            <InputField
              label="Room Code"
              value={code}
              onChangeText={setCode}
              error={!code && !!error}
            />
            <InputField
              label="Capacity"
              value={capacity}
              onChangeText={setCapacity}
              error={!capacity && !!error}
              numeric
            />
          </View>

          <PickerField
            title="Building"
            selectedValue={selectedBuildingId}
            onValueChange={setSelectedBuildingId}
            options={buildings.map((b) => ({ label: b.name, value: b.id }))}
            error={!selectedBuildingId && !!error}
          />

          <PickerField
            title="Department"
            selectedValue={selectedDepartmentId}
            onValueChange={setSelectedDepartmentId}
            options={departments.map((d) => ({ label: d.name, value: d.id }))}
            error={!selectedDepartmentId && !!error}
          />

          <View>
            <Text className="text-sm font-inter-bold mb-4">
              Facilities Included
            </Text>
            <View>
              {Object.entries(facilities).map(([key, value]) => (
                <TouchableOpacity
                  key={key}
                  activeOpacity={0.5}
                  className="flex-row items-center py-3"
                  onPress={() => toggleFacility(key as keyof typeof facilities)}
                >
                  <Ionicons
                    name="ellipse"
                    size={12}
                    color={value ? COLORS.blue : COLORS.white}
                    className={`${
                      value ? "border-blue" : "border-border"
                    } border p-[2px] rounded-full`}
                  />
                  <Text className="ml-4 capitalize font-inter-medium">
                    {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <FormButton
            label="Save Changes"
            onPress={handleEditRoom}
            loading={loading}
            isDisabled={isUnchanged}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditRoom;
