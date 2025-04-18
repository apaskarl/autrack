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
        name="(profile)"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default InstructorTabsLayout;
