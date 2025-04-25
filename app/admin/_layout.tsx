import { Drawer } from "expo-router/drawer";
import { COLORS } from "@/constants/colors";
import DrawerIcon from "@/components/shared/ui/DrawerIcon";
import { Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const customBackButton = () => (
  <TouchableOpacity
    activeOpacity={0.5}
    onPress={() => router.back()}
    className="ml-8"
  >
    <Ionicons name="chevron-back" size={25} color="#333" />
  </TouchableOpacity>
);

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        headerShadowVisible: false,
        drawerType: "slide",
        drawerActiveTintColor: COLORS.black,
        drawerInactiveTintColor: COLORS.black,
        drawerActiveBackgroundColor: "transparent",
        drawerStyle: {
          paddingTop: 25,
          paddingLeft: 10,
        },
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />

      <Drawer.Screen
        name="settings"
        options={{
          title: "",
          headerShown: true,
          headerLeft: customBackButton,
          drawerIcon: ({ color, size }) => (
            <DrawerIcon
              icon="settings-outline"
              iconPack="ionicons"
              name="Settings"
            />
          ),
        }}
      />
    </Drawer>
  );
}
