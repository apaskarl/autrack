import { Stack } from "expo-router";
import HeaderBack from "@/components/shared/header/HeaderBack";
import HeaderTitle from "@/components/shared/header/HeaderTitle";

export default function InstructorProfileStack() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "",
          headerShown: false,
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="edit-profile"
        options={{
          title: "",
          headerLeft: () => <HeaderBack />,
          headerTitle: () => <HeaderTitle title="Edit Profile" />,
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: "",
          headerLeft: () => <HeaderBack />,
          headerTitle: () => <HeaderTitle title="Settings" />,
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="appearance"
        options={{
          title: "",
          headerLeft: () => <HeaderBack />,
          headerTitle: () => <HeaderTitle title="Appearance" />,
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
}
