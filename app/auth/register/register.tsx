import { View, Text, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthInput from "@/components/auth/AuthInput";
import AuthButton from "@/components/auth/AuthButton";
import { auth } from "@/firebase";
import { db } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

const Register = () => {
  const [formData, setFormData] = useState({
    employeeId: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async () => {
    setLoading(true);
    const {
      employeeId,
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    } = formData;

    // Check if any field is empty
    if (
      !employeeId.trim() ||
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      Alert.alert("Error", "All fields are required.");
      setLoading(false);
      return;
    }

    // Check if employeeId is a number
    if (isNaN(Number(employeeId))) {
      Alert.alert("Error", "Employee ID must be a number.");
      setLoading(false);
      return;
    }

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        employeeId: Number(employeeId),
        firstName,
        lastName,
        email,
        photoURL:
          "https://res.cloudinary.com/dsbbcevcp/image/upload/v1744735512/user_itndrd.jpg",
        createdAt: new Date(),
      });

      Alert.alert("Success", "Account created successfully.");
      setLoading(false);
      router.push("/instructor/home");
    } catch (error: any) {
      Alert.alert("Registration Failed", error.message);
    }
  };

  return (
    <AuthLayout
      title="Register an account"
      description="Please enter your information to register an account."
    >
      <View className="gap-y-5">
        <AuthInput
          label="Employee ID"
          value={formData.employeeId}
          onChangeText={(text) => handleChange("employeeId", text)}
        />
        <View className="flex-row justify-between gap-x-5">
          <View className="flex-1">
            <AuthInput
              label="First Name"
              value={formData.firstName}
              onChangeText={(text) => handleChange("firstName", text)}
            />
          </View>
          <View className="flex-1">
            <AuthInput
              label="Last Name"
              value={formData.lastName}
              onChangeText={(text) => handleChange("lastName", text)}
            />
          </View>
        </View>

        <AuthInput
          label="Email"
          value={formData.email}
          onChangeText={(text) => handleChange("email", text)}
          email
        />

        <AuthInput
          label="Create Password"
          value={formData.password}
          onChangeText={(text) => handleChange("password", text)}
          password
        />

        <AuthInput
          label="Confirm Password"
          value={formData.confirmPassword}
          onChangeText={(text) => handleChange("confirmPassword", text)}
          password
        />

        <AuthButton
          label={loading ? "Registering..." : "Register"}
          onPress={handleRegister}
          disabled={loading}
        />
      </View>

      <View className="flex-row items-center gap-x-1 justify-center">
        <Text className="font-inter text-subtext">
          Already have an account?
        </Text>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.8}>
          <Text className="font-inter-semibold text-primary underline">
            Log in
          </Text>
        </TouchableOpacity>
      </View>
    </AuthLayout>
  );
};

export default Register;
