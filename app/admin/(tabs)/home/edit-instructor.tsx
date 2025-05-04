import React, { useEffect, useMemo, useState } from "react";
import { View, Text, TouchableOpacity, Alert, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { useLocalSearchParams, router } from "expo-router";
import InputField from "@/components/shared/ui/InputField";
import PickerField from "@/components/shared/ui/PickerField";
import { pickImage } from "@/utils/pickImage";
import { uploadImage } from "@/utils/uploadImage";
import useDepartmentStore from "@/store/useDepartmentStore";
import { useInstructorStore } from "@/store/useInstructorStore";
import FormButton from "@/components/shared/ui/FormButton";

const EditInstructor = () => {
  const { id } = useLocalSearchParams();
  const { instructors, updateInstructor } = useInstructorStore();
  const { departments, fetchDepartments } = useDepartmentStore();

  const instructor = instructors.find((inst) => inst.id === id);

  const [image, setImage] = useState<string | null>(instructor?.image || null);
  const [firstName, setFirstName] = useState(instructor?.firstName || "");
  const [lastName, setLastName] = useState(instructor?.lastName || "");
  const [employeeID, setEmployeeID] = useState(
    instructor?.employeeId?.toString() || ""
  );
  const [email, setEmail] = useState(instructor?.email || "");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(
    instructor?.departmentId || ""
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isUnchanged = useMemo(() => {
    return (
      image === (instructor?.image || null) &&
      firstName === (instructor?.firstName || "") &&
      lastName === (instructor?.lastName || "") &&
      employeeID === (instructor?.employeeId?.toString() || "") &&
      email === (instructor?.email || "") &&
      selectedDepartmentId === (instructor?.departmentId || "")
    );
  }, [
    image,
    firstName,
    lastName,
    employeeID,
    email,
    selectedDepartmentId,
    instructor,
  ]);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleImagePick = async () => {
    const uri = await pickImage();
    if (uri) setImage(uri);
  };

  const handleUpdateInstructor = async () => {
    if (
      !firstName ||
      !lastName ||
      !employeeID ||
      !email ||
      !selectedDepartmentId
    ) {
      setError("Please fill out all the fields.");
      return;
    }

    try {
      setLoading(true);

      let imageURL = instructor?.image;
      if (image && image !== instructor?.image) {
        imageURL = await uploadImage(image, {
          uploadPreset: "autrack",
          cloudName: "dsbbcevcp",
        });
      }

      await updateInstructor(id as string, {
        image: imageURL!,
        firstName,
        lastName,
        employeeId: parseInt(employeeID),
        email,
        departmentId: selectedDepartmentId,
      });

      Alert.alert("Success", "Instructor updated successfully.", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      setError("Failed to update instructor.");
    } finally {
      setLoading(false);
    }
  };

  if (!instructor) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <Text className="text-red">Instructor not found.</Text>
      </SafeAreaView>
    );
  }

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
              onPress={handleImagePick}
              className="px-4 py-2 mb-[-8px]"
            >
              <Text className="font-inter-bold text-sm">
                {image ? "Change image" : "Choose image"}
              </Text>
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

          <InputField
            label="Email"
            value={email}
            onChangeText={setEmail}
            error={!email && !!error}
            email
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

          <FormButton
            label="Save Changes"
            onPress={handleUpdateInstructor}
            loading={loading}
            isDisabled={isUnchanged}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditInstructor;
