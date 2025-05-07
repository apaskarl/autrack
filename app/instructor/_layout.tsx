import React from "react";
import { Stack } from "expo-router";

const InstructorTabsLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
};

export default InstructorTabsLayout;
