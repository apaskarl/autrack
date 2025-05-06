import React from "react";
import { Stack } from "expo-router";
import HeaderBack from "@/components/shared/header/HeaderBack";
import HeaderTitle from "@/components/shared/header/HeaderTitle";

const ResetLayout = () => {
  return (
    <Stack screenOptions={{ headerShadowVisible: false }}>
      <Stack.Screen
        name="forgot-password"
        options={{
          headerLeft: () => <HeaderBack />,
          headerTitle: () => <HeaderTitle title="Forgot password" />,
        }}
      />
      <Stack.Screen name="verify-email" />
      <Stack.Screen name="new-password" />
      <Stack.Screen name="success" />
    </Stack>
  );
};

export default ResetLayout;
