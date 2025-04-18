import React from "react";
import { Stack } from "expo-router";

const ProfileLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="edit-profile"
        options={{
          title: "Edit Profile",
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
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: "Settings",
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
        }}
      />
    </Stack>
  );
};

export default ProfileLayout;
