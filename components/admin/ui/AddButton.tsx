import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { FontAwesome6 } from "@expo/vector-icons";

const AddButton = ({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="absolute bottom-5 right-5 flex-row items-center gap-x-2 rounded-full bg-primary px-6 py-4"
      style={{ elevation: 2 }}
    >
      <FontAwesome6 name="plus" size={15} color="white" />
      <Text className="font-inter-bold text-white">{label}</Text>
    </TouchableOpacity>
  );
};

export default AddButton;
