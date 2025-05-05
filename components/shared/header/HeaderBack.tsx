import { TouchableOpacity } from "react-native";
import React from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const HeaderBack = () => {
  return (
    <TouchableOpacity activeOpacity={0.5} onPress={() => router.back()}>
      <Ionicons name="arrow-back" size={22} color="black" />
    </TouchableOpacity>
  );
};

export default HeaderBack;
