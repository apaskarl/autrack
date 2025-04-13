import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

interface AuthButtonProps {
  label: string;
  onPress?: () => void;
}

const AuthButton = ({ label, onPress }: AuthButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="bg-primary w-full rounded-lg p-5"
    >
      <Text className="font-inter-bold text-center text-white">{label}</Text>
    </TouchableOpacity>
  );
};

export default AuthButton;
