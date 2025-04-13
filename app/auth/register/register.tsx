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
import AuthInput from "@/components/auth/AuthInput";
import AuthButton from "@/components/auth/AuthButton";

const Register = () => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="bg-white h-full"
    >
      <ScrollView className="p-8" showsVerticalScrollIndicator={false}>
        <View className="gap-y-10">
          {/* Header */}
          <View>
            <View className="items-start">
              <TouchableOpacity
                onPress={() => router.back()}
                activeOpacity={0.8}
                className="p-1 items-start ml-[-4px]"
              >
                <Ionicons name="chevron-back-outline" size={32} color="black" />
              </TouchableOpacity>
            </View>

            <View>
              <Text className="font-inter-bold text-2xl mt-4 mb-2">
                Register an account
              </Text>
              <Text className="font-inter text-subtext leading-relaxed">
                Please enter your information to register an account
              </Text>
            </View>
          </View>

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
          <Text className="text-center leading-relaxed px-5 font-inter mt-4">
            Already have an account?{" "}
            <Text
              onPress={() => router.back()}
              className="text-primary underline font-inter-semibold"
            >
              Log in
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Register;
