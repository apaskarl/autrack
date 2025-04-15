import { View, Text } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";
import { router } from "expo-router";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthButton from "@/components/auth/AuthButton";

const Success = () => {
  const handleSuccess = () => {
    router.push("/auth/login");
    router.dismissAll();
  };

  return (
    <AuthLayout success>
      <View className="h-[90%] justify-center items-center gap-y-10">
        <Ionicons
          name="shield-checkmark-outline"
          size={75}
          color={COLORS.primary}
        />

        <View className="items-center gap-y-4">
          <Text className="font-inter-bold text-4xl ">Success!</Text>
          <Text className="text-center font-inter leading-relaxed text-subtext">
            Congratulations! Your password has been changed. Click continue to
            log in.
          </Text>
        </View>

        <AuthButton onPress={handleSuccess} label="Continue" />
      </View>
    </AuthLayout>
  );
};

export default Success;
