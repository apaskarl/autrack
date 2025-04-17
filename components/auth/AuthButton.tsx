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
        } bg-primary w-full relative rounded-lg p-5`}
        disabled={disabled}
      >
        <Text className="font-inter-bold text-center text-white">{label}</Text>
      </TouchableOpacity>

      {disabled && (
        <ActivityIndicator
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          size="small"
          color={COLORS.light}
        />
      )}
    </View>
  );
};

export default AuthButton;
