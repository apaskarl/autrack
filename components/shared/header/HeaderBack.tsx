import { TouchableOpacity } from "react-native";
import React from "react";
import { router } from "expo-router";
import { FontAwesome6 } from "@expo/vector-icons";

const HeaderBack = () => {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={() => router.back()}
      className="aspect-square rounded-full p-2"
    >
      <FontAwesome6 name="arrow-left" size={20} color="black" />
    </TouchableOpacity>
  );
};

export default HeaderBack;
