import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Modal from "react-native-modal";
import useDepartmentStore from "@/store/useDepartmentStore";
import { useInstructorStore } from "@/store/useInstructorStore";
import { SafeAreaView } from "react-native-safe-area-context";

interface AddInstructorModalProps {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
}

const AddInstructorModal = ({
  showModal,
  setShowModal,
}: AddInstructorModalProps) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [employeeID, setEmployeeID] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { departments, fetchDepartments } = useDepartmentStore();
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
  const { addInstructor, loading } = useInstructorStore();

  useEffect(() => {
    if (showModal) {
      fetchDepartments();
    }
  }, [showModal]);

  const handleAddInstructor = async () => {
    if (
      !firstName ||
      !lastName ||
      !employeeID ||
      !email ||
      !password ||
      !selectedDepartmentId
    ) {
      Alert.alert("Missing Fields", "Please fill in all fields.");
      return;
    }

    try {
      await addInstructor(
        firstName,
        lastName,
        parseInt(employeeID),
        email,
        password,
        selectedDepartmentId
      );

      // Reset form
      setFirstName("");
      setLastName("");
      setEmployeeID("");
      setEmail("");
      setPassword("");
      setSelectedDepartmentId("");

      setShowModal(false);
    } catch (error) {
      // Error is already handled in the store
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
          <Text className="font-inter-bold text-lg mb-6">
            Add New Instructor
          </Text>

          <View className="gap-y-4 mb-6">
            <TextInput
              placeholder="First Name"
              value={firstName}
              onChangeText={setFirstName}
              className="border border-border font-inter-medium rounded-lg p-4"
            />
            <TextInput
              placeholder="Last Name"
              value={lastName}
              onChangeText={setLastName}
              className="border border-border font-inter-medium rounded-lg p-4"
            />
            <TextInput
              placeholder="Employee ID"
              value={employeeID}
              onChangeText={setEmployeeID}
              keyboardType="numeric"
              className="border border-border font-inter-medium rounded-lg p-4"
            />
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              className="border border-border font-inter-medium rounded-lg p-4"
            />
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              className="border border-border font-inter-medium rounded-lg p-4"
            />

            <View className="border border-border rounded-lg">
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
          </View>

          <View className="flex-row justify-between gap-x-4">
            <TouchableOpacity
              activeOpacity={0.7}
              className={`${
                loading && "opacity-50"
              } p-4 rounded-lg flex-1 border border-border items-center justify-center`}
              onPress={() => setShowModal(false)}
              disabled={loading}
            >
              <Text className="text-gray-700 font-inter-semibold">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              className={`${
                loading && "opacity-50"
              } bg-blue p-4 rounded-lg flex-1 border border-border items-center justify-center`}
              onPress={handleAddInstructor}
              disabled={loading}
            >
              <Text className="text-white font-inter-semibold">
                {loading ? "Adding..." : "Add"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default AddInstructorModal;
