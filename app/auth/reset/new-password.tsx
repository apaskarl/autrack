import { View } from "react-native";
import React from "react";
import { router } from "expo-router";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthInput from "@/components/auth/AuthInput";
import AuthButton from "@/components/auth/AuthButton";

const NewPassword = () => {
  return (
    <AuthLayout
      title="Set a new password"
      description="Create a new password. Ensure it differs from previous ones for security."
    >
      <View className="gap-y-5">
        <AuthInput label="New password" password />
        <AuthInput label="Confirm new password" password />
        <AuthButton
          label="Update Password"
          onPress={() => router.push("/auth/reset/success")}
        />
      </View>
    </AuthLayout>
  );
};

export default NewPassword;
