import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const FilterButton = ({
  label,
  onPress,
  active,
  number,
}: {
  label: string;
  onPress?: () => void;
  number?: number;
  active?: boolean;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.5}
      className={`${active ? "border-primary" : "border-border"} mr-3 flex-row items-center gap-x-2 rounded-full border px-4 py-2`}
    >
      {active && label === "Departments" && (
        <View className="h-5 w-5 items-center justify-center rounded-3xl bg-primary">
          <Text className="font-inter-bold text-sm text-white">{number}</Text>
        </View>
      )}
      <Text
        className={`${active ? "font-inter-semibold" : "font-inter-medium"} text-sm`}
      >
        {label}
      </Text>
      <Ionicons name="caret-down-outline" size={15} />
    </TouchableOpacity>
  );
};

export default FilterButton;
