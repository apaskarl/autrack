import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React from "react";
import { COLORS } from "@/constants/colors";

const AuthButton = ({
  label,
  onPress,
  disabled = false,
}: {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
}) => {
  return (
    <View className="relative">
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        className={`${
          disabled ? "opacity-60" : ""
        } relative w-full rounded-xl bg-primary p-5`}
        disabled={disabled}
      >
        <Text className="text-center font-inter-bold text-white">
          {disabled ? <ActivityIndicator size="small" color="white" /> : label}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AuthButton;
