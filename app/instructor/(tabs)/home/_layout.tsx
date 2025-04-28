import { Stack } from "expo-router";
import HeaderBack from "@/components/shared/header/HeaderBack";
import HeaderTitle from "@/components/shared/header/HeaderTitle";
import LogoName from "@/components/shared/ui/LogoName";
import { View } from "react-native";

export default function InstructorHomeStack() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "",
          headerTitle: () => (
            <View className="ml-2 w-full bg-white">
              <LogoName />
            </View>
          ),
          headerShadowVisible: false,
        }}
      />

      <Stack.Screen
        name="schedule"
        options={{
          title: "",
          headerLeft: () => <HeaderBack />,
          headerTitle: () => <HeaderTitle title="Class Schedule" />,
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
}
