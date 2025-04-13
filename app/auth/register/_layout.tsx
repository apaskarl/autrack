import React from "react";
import { Stack } from "expo-router";
import { View } from "react-native";

const RegisterLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="register"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default RegisterLayout;
