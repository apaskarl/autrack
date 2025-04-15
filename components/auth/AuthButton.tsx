import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

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
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`${
        disabled ? "opacity-60" : ""
      } bg-primary w-full rounded-lg p-5`}
      disabled={disabled}
    >
      <Text className="font-inter-bold text-center text-white">{label}</Text>
    </TouchableOpacity>
  );
};

export default AuthButton;
