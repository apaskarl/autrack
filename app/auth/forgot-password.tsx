import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import AuthInput from "@/components/inputs/AuthInput";
import AuthButton from "@/components/buttons/AuthButton";

const ForgotPassword = () => {
  return (
    <View className="bg-white p-8 h-full gap-y-10">
      <View>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.8}>
          <Ionicons name="arrow-back-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View className="gap-y-10">
        <View>
          <Text className="font-inter-bold text-3xl mb-4">
            Forgot password?
          </Text>
          <Text className="font-inter text-subtext">
            Please enter your email to reset the password
          </Text>
        </View>

        <View className="gap-y-5">
          <AuthInput label="Email" />
          <AuthButton
            label="Reset Password"
            onPress={() => router.push("/auth/verify-email")}
          />
        </View>
      </View>
    </View>
  );
};

export default ForgotPassword;
