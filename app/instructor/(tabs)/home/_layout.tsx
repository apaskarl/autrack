import { Stack } from "expo-router";
import HeaderBack from "@/components/shared/header/HeaderBack";
import HeaderTitle from "@/components/shared/header/HeaderTitle";
import LogoName from "@/components/shared/ui/LogoName";
import { View } from "react-native";

export default function InstructorHomeStack() {
  return (
    <Stack screenOptions={{ headerShadowVisible: false }}>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          headerTitle: () => (
            <View className="ml-2 w-full bg-white">
              <LogoName />
            </View>
          ),
        }}
      />

      <Stack.Screen
        name="schedule"
        options={{
          headerLeft: () => <HeaderBack />,
          headerTitle: () => <HeaderTitle title="Class Schedule" />,
        }}
      />

      <Stack.Screen
        name="room-schedules"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
