import { Stack } from "expo-router";
import HeaderBack from "@/components/shared/header/HeaderBack";
import HeaderTitle from "@/components/shared/header/HeaderTitle";
import LogoName from "@/components/shared/ui/LogoName";
import { View } from "react-native";

export default function AdminHomeStack() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "",
          headerTitle: () => (
            <View className="ml-1 w-full bg-white">
              <LogoName />
            </View>
          ),
          headerShadowVisible: false,
        }}
      />

      <Stack.Screen
        name="rooms"
        options={{
          title: "",
          headerLeft: () => <HeaderBack />,
          headerTitle: () => <HeaderTitle title="Rooms" />,
          headerShadowVisible: false,
        }}
      />

      <Stack.Screen
        name="room-details"
        options={{
          title: "",
          headerLeft: () => <HeaderBack />,
          headerTitle: () => <HeaderTitle title="Room Details" />,
          headerShadowVisible: false,
        }}
      />

      <Stack.Screen
        name="add-room"
        options={{
          title: "",
          headerLeft: () => <HeaderBack />,
          headerTitle: () => <HeaderTitle title="Add New Room" />,
          headerShadowVisible: false,
        }}
      />

      <Stack.Screen
        name="edit-room"
        options={{
          title: "",
          headerLeft: () => <HeaderBack />,
          headerTitle: () => <HeaderTitle title="Edit Room" />,
          headerShadowVisible: false,
        }}
      />

      <Stack.Screen
        name="instructors"
        options={{
          title: "",
          headerLeft: () => <HeaderBack />,
          headerTitle: () => <HeaderTitle title="Instructors" />,
          headerShadowVisible: false,
        }}
      />

      <Stack.Screen
        name="instructor-details"
        options={{
          title: "",
          headerLeft: () => <HeaderBack />,
          headerTitle: () => <HeaderTitle title="Instructor Details" />,
          headerShadowVisible: false,
        }}
      />
    </Stack>
  );
}
