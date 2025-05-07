import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";

type SortOption =
  | "default"
  | "date_asc"
  | "date_desc"
  | "name_asc"
  | "name_desc";

interface SortButtonProps {
  label: string;
  value: SortOption;
  currentSortOption: SortOption;
  onPress: () => void;
}

const SortButton: React.FC<SortButtonProps> = ({
  label,
  value,
  currentSortOption,
  onPress,
}) => {
  const isSelected = currentSortOption === value;

  return (
    <TouchableOpacity
      className="flex-row items-center justify-between py-4"
      activeOpacity={0.5}
      onPress={onPress}
    >
      <Text
        className={`font-inter-medium ${isSelected ? "text-black" : "text-subtext"}`}
      >
        {label}
      </Text>

      <Ionicons
        name="ellipse"
        className={`${isSelected ? "border-primary" : "border-border"} rounded-full border p-[2px]`}
        color={isSelected ? COLORS.primary : COLORS.white}
      />
    </TouchableOpacity>
  );
};
export default SortButton;
