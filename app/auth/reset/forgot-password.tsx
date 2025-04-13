import { View } from "react-native";
import React from "react";
import { router } from "expo-router";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthInput from "@/components/auth/AuthInput";
import AuthButton from "@/components/auth/AuthButton";

const ForgotPassword = () => {
  return (
    <AuthLayout
      title="Forgot password?"
      description="Please enter your email to reset the password."
    >
      <View className="gap-y-5">
        <AuthInput label="Email" />
        <AuthButton
          label="Reset Password"
          onPress={() => router.push("/auth/reset/verify-email")}
        />
      </View>
    </AuthLayout>
  );
};

export default ForgotPassword;
