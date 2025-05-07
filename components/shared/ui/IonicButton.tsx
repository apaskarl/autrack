import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const IonicButton = ({
  icon,
  className,
  size = 30,
  onPress,
  color = "black",
}: {
  icon: string;
  className?: string;
  size?: number;
  onPress?: () => void;
  color?: string;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.6}
      className={`${className} p-2`}
    >
      <Ionicons name={icon as any} size={size} color={color} />
    </TouchableOpacity>
  );
};

export default IonicButton;
