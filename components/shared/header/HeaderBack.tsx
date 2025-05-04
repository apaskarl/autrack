import { TouchableOpacity } from "react-native";
import React from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const HeaderBack = () => {
  return (
    <TouchableOpacity activeOpacity={0.5} onPress={() => router.back()}>
      <Ionicons name="chevron-back" size={24} color="#333" />
    </TouchableOpacity>
  );
};

export default HeaderBack;
