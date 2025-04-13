import React from "react";
import { Stack } from "expo-router";

const AuthLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="login"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="forgot-password"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="verify-email"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="new-password"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="success"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </>
  );
};

export default AuthLayout;
