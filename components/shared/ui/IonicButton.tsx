import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const IonicButton = ({
  icon,
  className,
  size = 30,
  label,
  onPress,
}: {
  icon: string;
  className?: string;
  size?: number;
  label?: string;
  onPress?: () => void;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.6}
      className={`${className} ${
        label && "bg-blue px-4 py-3 rounded-lg"
      } flex-row items-center gap-x-2 p-2`}
    >
      <Ionicons
        name={icon as any}
        size={size}
        color={label ? "white" : "black"}
      />

      {label && (
        <Text className="font-inter-bold text-sm text-white">{label}</Text>
      )}
    </TouchableOpacity>
  );
};

export default IonicButton;
