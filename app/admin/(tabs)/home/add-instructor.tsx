import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert, Image } from "react-native";
import useDepartmentStore from "@/store/useDepartmentStore";
import { useInstructorStore } from "@/store/useInstructorStore";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import InputField from "@/components/shared/ui/InputField";
import PickerField from "@/components/shared/ui/PickerField";
import { pickImage } from "@/utils/pickImage";
import { takePhoto } from "@/utils/takePhoto";
import { uploadImage } from "@/utils/uploadImage";
import { router } from "expo-router";
import FormButton from "@/components/shared/ui/FormButton";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";

const AddInstructor = () => {
  const { addInstructor } = useInstructorStore();
  const { departments, fetchDepartments } = useDepartmentStore();

  const [image, setImage] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [employeeID, setEmployeeID] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPhotoModal, setShowPhotoModal] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleImagePick = async () => {
    setShowPhotoModal(false);
    const uri = await pickImage();
    if (uri) setImage(uri);
  };

  const handleTakePhoto = async () => {
    setShowPhotoModal(false);
    const uri = await takePhoto();
    if (uri) setImage(uri);
  };

  const handleAddInstructor = async () => {
    if (
      !firstName ||
      !lastName ||
      !employeeID ||
      !email ||
      !password ||
      !selectedDepartmentId
    ) {
      setError("Please fill out all the fields.");
      return;
    }

    try {
      setLoading(true);

      let imageURL =
        "https://res.cloudinary.com/dsbbcevcp/image/upload/v1744735512/user_itndrd.jpg";

      if (image) {
        imageURL = await uploadImage(image, {
          uploadPreset: "autrack",
          cloudName: "dsbbcevcp",
        });
      }

      await addInstructor(
        imageURL,
        firstName,
        lastName,
        parseInt(employeeID),
        email,
        password,
        selectedDepartmentId
      );

      Alert.alert("Success", "Instructor added successfully.", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);

      setFirstName("");
      setLastName("");
      setEmployeeID("");
      setEmail("");
      setPassword("");
      setSelectedDepartmentId("");
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

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

          <View className="self-center items-center">
            <Image
              source={{
                uri:
                  image ||
                  "https://res.cloudinary.com/dsbbcevcp/image/upload/v1744735512/user_itndrd.jpg",
              }}
              className="h-28 aspect-square rounded-full mb-2"
            />

            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => setShowPhotoModal(true)}
              className="px-4 py-2 mb-[-8px]"
            >
              <Text className="font-inter-bold text-sm">Choose Image</Text>
            </TouchableOpacity>
          </View>

          <InputField
            label="Employee ID"
            value={employeeID}
            onChangeText={setEmployeeID}
            numeric
            error={!employeeID && !!error}
          />

          <View className="flex-row gap-x-5">
            <InputField
              label="First Name"
              value={firstName}
              onChangeText={setFirstName}
              error={!firstName && !!error}
            />

            <InputField
              label="Last Name"
              value={lastName}
              onChangeText={setLastName}
              error={!lastName && !!error}
            />
          </View>

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

          <InputField
            label="Email"
            value={email}
            onChangeText={setEmail}
            error={!email && !!error}
            email
          />

          <InputField
            label="Password"
            value={password}
            onChangeText={setPassword}
            error={!password && !!error}
            password
          />

          <FormButton
            label="Add Instructor"
            onPress={handleAddInstructor}
            loading={loading}
          />
        </View>
      </ScrollView>

      <Modal
        isVisible={showPhotoModal}
        onBackButtonPress={() => setShowPhotoModal(false)}
        onBackdropPress={() => setShowPhotoModal(false)}
        animationIn="fadeIn"
        animationOut="fadeOut"
        backdropOpacity={0}
        statusBarTranslucent
        style={{ margin: 0, padding: 0 }}
      >
        <View className="flex-1 justify-center items-center bg-black/50 px-8">
          <View className="relative bg-white rounded-3xl p-5 w-full">
            <Text className="text-lg font-inter-bold mb-4">Choose Image</Text>

            <View>
              <TouchableOpacity
                onPress={handleImagePick}
                activeOpacity={0.5}
                className="py-4"
              >
                <Text className="font-inter-medium text-black">
                  Open gallery
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleTakePhoto}
                activeOpacity={0.5}
                className="py-4"
              >
                <Text className="font-inter-medium text-black">Take photo</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => setShowPhotoModal(false)}
              className="absolute right-2 top-2 p-3"
            >
              <Ionicons name="close" size={20} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default AddInstructor;
