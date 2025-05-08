import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert, Image } from "react-native";
import useDepartmentStore from "@/store/useDepartmentStore";
import { useInstructorStore } from "@/store/useInstructorStore";
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
import AdminHomeLayout from "@/components/admin/layouts/AdminHomeLayout";

const AddInstructor = () => {
  const { addInstructor } = useInstructorStore();
  const { departments, fetchDepartments } = useDepartmentStore();

  const [image, setImage] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [employeeID, setEmployeeID] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    if (
      !firstName ||
      !lastName ||
      !employeeID ||
      !email ||
      !password ||
      !confirmPassword ||
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
        selectedDepartmentId,
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

          <View className="items-center self-center">
            <Image
              source={{
                uri:
                  image ||
                  "https://res.cloudinary.com/dsbbcevcp/image/upload/v1744735512/user_itndrd.jpg",
              }}
              className="mb-2 aspect-square h-28 rounded-full"
            />

            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => setShowPhotoModal(true)}
              className="mb-[-8px] px-4 py-2"
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
            <View className="flex-1">
              <InputField
                label="First Name"
                value={firstName}
                onChangeText={setFirstName}
                error={!firstName && !!error}
              />
            </View>

            <View className="flex-1">
              <InputField
                label="Last Name"
                value={lastName}
                onChangeText={setLastName}
                error={!lastName && !!error}
              />
            </View>
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

          <InputField
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            error={!confirmPassword && !!error}
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
        <View className="flex-1 items-center justify-center bg-black/50 px-8">
          <View className="relative w-full rounded-3xl bg-white p-5">
            <Text className="mb-4 font-inter-bold text-lg">Choose Image</Text>

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
    </AdminHomeLayout>
  );
};

export default AddInstructor;
