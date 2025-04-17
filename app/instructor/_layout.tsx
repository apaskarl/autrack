import React from "react";
import { Stack } from "expo-router";
import { Text, TouchableOpacity } from "react-native";

const InstructorTabsLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />

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
            fontSize: 16,
            fontWeight: "600",
            color: "#333",
          },
          // headerRight: () => (
          //   <TouchableOpacity onPress={() => alert("Save profile")}>
          //     <Text className="mr-5 font-inter-semibold">Save</Text>
          //   </TouchableOpacity>
          // ),
        }}
      />
    </Stack>
  );
};

export default InstructorTabsLayout;
