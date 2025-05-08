import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, Alert, Image } from "react-native";
import useRoomStore from "@/store/useRoomStore";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";
import useDepartmentStore from "@/store/useDepartmentStore";
import useBuildingStore from "@/store/useBuildingStore";
import { router } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import InputField from "@/components/shared/ui/InputField";
import PickerField from "@/components/shared/ui/PickerField";
import { uploadImage } from "@/utils/uploadImage";
import { pickImage } from "@/utils/pickImage";
import FormButton from "@/components/shared/ui/FormButton";
import AdminHomeLayout from "@/components/admin/layouts/AdminHomeLayout";

const AddRoom = () => {
  const { addRoom } = useRoomStore();
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

  const toggleFacility = (key: keyof typeof facilities) => {
    setFacilities((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    fetchDepartments();
    fetchBuildings();
  }, []);

  const handleImagePick = async () => {
    const uri = await pickImage();
    if (uri) setImage(uri);
  };

  const handleAddRoom = async () => {
    if (
      !name ||
      !code ||
      !capacity ||
      !selectedBuildingId ||
      !selectedDepartmentId
    ) {
      setError("Please fill out all the fields.");
      return;
    } else if (!image) {
      setError("To proceed, please upload an image of the room.");
      return;
    } else if (isNaN(Number(capacity)) || capacity.trim() === "") {
      setError("Capacity must be a valid number.");
      return;
    }

    try {
      setLoading(true);

      const imageURL = await uploadImage(image, {
        uploadPreset: "autrack-rooms",
        cloudName: "dsbbcevcp",
      });

      await addRoom(
        name,
        imageURL,
        selectedBuildingId,
        selectedDepartmentId,
        code,
        parseInt(capacity),
        facilities,
      );

      Alert.alert("Success", "Room added successfully.", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);

      setImage(null);
      setName("");
      setCode("");
      setCapacity("");
      setSelectedBuildingId("");
      setSelectedDepartmentId("");
      setFacilities({
        airConditioned: false,
        blackboard: false,
        tv: false,
        wifi: false,
        projector: false,
      });
    } catch (error) {
      Alert.alert("Error", "Failed to add room.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminHomeLayout>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="gap-y-6">
          {error && (
            <View className="rounded-full bg-red/10 px-5 py-4">
              <Text className="font-inter-medium text-sm text-red">
                {error}
              </Text>
            </View>
          )}

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleImagePick}
            className="relative"
          >
            {!image ? (
              <View className="h-60 items-center justify-center rounded-xl border border-dashed border-border bg-gray-100">
                <Ionicons
                  name="images-outline"
                  size={30}
                  color={COLORS.subtext}
                />
                <Text className="mt-3 font-inter-medium text-sm text-subtext">
                  Choose an image
                </Text>
              </View>
            ) : (
              <>
                <Image
                  source={{ uri: image }}
                  className="h-60 w-full rounded-xl bg-black opacity-80"
                />
                <View className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center">
                  <Ionicons
                    name="images-outline"
                    size={30}
                    color={COLORS.white}
                  />
                  <Text className="mt-3 font-inter-medium text-sm text-white">
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
            <View className="flex-1">
              <InputField
                label="Room Code"
                value={code}
                onChangeText={setCode}
                error={!code && !!error}
              />
            </View>

            <View className="flex-1">
              <InputField
                label="Capacity"
                value={capacity}
                onChangeText={setCapacity}
                error={!capacity && !!error}
                numeric
              />
            </View>
          </View>

          <PickerField
            title="Building"
            selectedValue={selectedBuildingId}
            onValueChange={setSelectedBuildingId}
            options={buildings.map((building) => ({
              label: building.name,
              value: building.id,
            }))}
            error={!selectedBuildingId && !!error}
          />

          <PickerField
            title="Department"
            selectedValue={selectedDepartmentId}
            onValueChange={setSelectedDepartmentId}
            options={departments.map((department) => ({
              label: department.name,
              value: department.id,
            }))}
            error={!selectedDepartmentId && !!error}
          />

          <View>
            <Text className="mb-4 font-inter-bold text-sm">
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
                  <View>
                    <Ionicons
                      name="ellipse"
                      size={12}
                      color={value ? COLORS.blue : COLORS.white}
                      className={`${
                        value ? "border-blue" : "border-border"
                      } rounded-full border p-[2px]`}
                    />
                  </View>

                  <Text className="ml-4 font-inter-medium capitalize">
                    {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <FormButton
            label="Add Room"
            onPress={handleAddRoom}
            loading={loading}
          />
        </View>
      </ScrollView>
    </AdminHomeLayout>
  );
};

export default AddRoom;
