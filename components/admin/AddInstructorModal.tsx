import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/firebase";
import {
  collection,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import Modal from "react-native-modal";

interface AddInstructorModalProps {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
}

type Department = {
  id: string;
  name: string;
};

const AddInstructorModal = ({
  showModal,
  setShowModal,
}: AddInstructorModalProps) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [employeeID, setEmployeeID] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const snapshot = await getDocs(collection(db, "departments"));
        const deptList: Department[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().departmentName,
        }));
        setDepartments(deptList);
      } catch (error) {
        console.error("Failed to fetch departments", error);
      }
    };

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
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userData = {
        firstName,
        lastName,
        employeeId: parseInt(employeeID),
        email,
        departmentId: selectedDepartmentId,
        photoURL:
          "https://res.cloudinary.com/dsbbcevcp/image/upload/v1744735512/user_itndrd.jpg",
        role: "instructor",
        createdAt: serverTimestamp(),
      };

      await setDoc(doc(db, "users", user.uid), userData);
      setShowModal(false);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to add instructor.");
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
      <View className="flex-1 justify-center items-center bg-black/40">
        <View className="bg-white w-11/12 rounded-xl p-6">
          <Text className="font-inter-bold text-lg mb-4">Add Instructor</Text>

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
            className="border border-gray-300 rounded-md p-3 mb-3"
          />

          <View className="border border-gray-300 rounded-md mb-5">
            <Picker
              selectedValue={selectedDepartmentId}
              onValueChange={(itemValue) => setSelectedDepartmentId(itemValue)}
            >
              <Picker.Item label="Select Department" value="" />
              {departments.map((dept) => (
                <Picker.Item key={dept.id} label={dept.name} value={dept.id} />
              ))}
            </Picker>
          </View>

          <View className="flex-row justify-end gap-x-3">
            <TouchableOpacity
              className="px-4 py-2 bg-gray-200 rounded-lg"
              onPress={() => setShowModal(false)}
            >
              <Text className="text-gray-700 font-inter-semibold">Cancel</Text>
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
  );
};

export default AddInstructorModal;
