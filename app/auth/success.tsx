import { View, Text } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";
import AuthButton from "@/components/buttons/AuthButton";
import { router } from "expo-router";

const Success = () => {
  return (
    <View className="bg-white p-8 h-full">
      <View className="h-[75%] justify-center items-center gap-y-10">
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

        <AuthButton
          onPress={() => router.push("/auth/login")}
          label="Continue"
        />
      </View>
    </View>
  );
};

export default Success;
