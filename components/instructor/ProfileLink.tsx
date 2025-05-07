import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";

const ProfileLink = ({
  icon,
  label,
  onPress,
}: {
  icon: string;
  label: string;
  onPress?: () => void;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.5}
      className="flex-row items-center justify-between py-4"
    >
      <View className="flex-row items-center gap-x-5">
        <Ionicons name={icon as any} size={20} color={COLORS.subtext} />
        <Text className="font-inter-semibold">{label}</Text>
      </View>

      <Ionicons
        name="chevron-forward-outline"
        size={20}
        color={COLORS.subtext}
      />
    </TouchableOpacity>
  );
};

export default ProfileLink;
