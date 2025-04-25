import React from "react";
import { router, Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";

const customBackButton = () => (
  <TouchableOpacity
    activeOpacity={0.5}
    onPress={() => router.back()}
    className="ml-2"
  >
    <Ionicons name="chevron-back" size={24} color="#333" />
  </TouchableOpacity>
);

// Reusable screen options
const createScreenOptions = (title: string): NativeStackNavigationOptions => ({
  title,
  headerTitleAlign: "center",
  headerShadowVisible: false,
  headerStyle: {
    backgroundColor: "#ffffff",
  },
  headerTitleStyle: {
    fontFamily: "Inter-Bold",
    fontSize: 17,
    fontWeight: "600",
    color: "#333",
  },
  headerLeft: customBackButton,
});

const ProfileLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="edit-profile"
        options={createScreenOptions("Edit Profile")}
      />
      <Stack.Screen name="settings" options={createScreenOptions("Settings")} />
      <Stack.Screen
        name="appearance"
        options={createScreenOptions("Dark Mode")}
      />
    </Stack>
  );
};

export default ProfileLayout;
