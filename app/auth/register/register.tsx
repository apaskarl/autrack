import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthInput from "@/components/auth/AuthInput";
import AuthButton from "@/components/auth/AuthButton";

const Register = () => {
  return (
    <AuthLayout
      title="Register an account"
      description="Please enter your information to register an account."
    >
      <View className="gap-y-20">
        {/* Form */}
        <View className="gap-y-5">
          <AuthInput label="Employee ID" />
          <View className="flex-row justify-between gap-x-5">
            <View className="flex-1">
              <AuthInput label="First Name" />
            </View>
            <View className="flex-1">
              <AuthInput label="Last Name" />
            </View>
          </View>
          <AuthInput label="Email" email />
          <AuthInput label="Create Password" password />
          <AuthInput label="Confirm Password" password />
          <AuthButton label="Register" />
        </View>

        {/* Footer */}
        <View className="flex-row items-center gap-x-1 justify-center">
          <Text className="font-inter text-subtext">
            Already have an account?
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/auth/login")}
            activeOpacity={0.8}
          >
            <Text className="font-inter-semibold text-primary underline">
              Log in
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </AuthLayout>
  );
};

export default Register;
