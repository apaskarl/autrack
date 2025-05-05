import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const IonicButton = ({
  icon,
  className,
  size = 30,
  onPress,
}: {
  icon: string;
  className?: string;
  size?: number;
  onPress?: () => void;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.6}
      className={`${className} p-2`}
    >
      <Ionicons name={icon as any} size={size} color="black" />
    </TouchableOpacity>
  );
};

export default IonicButton;
