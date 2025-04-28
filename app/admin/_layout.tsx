import { Drawer } from "expo-router/drawer";
import { COLORS } from "@/constants/colors";
import DrawerIcon from "@/components/shared/ui/DrawerIcon";
import { Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import HeaderBack from "@/components/shared/header/HeaderBack";
import HeaderTitle from "@/components/shared/header/HeaderTitle";

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
        name="dashboard"
        options={{
          title: "",
          headerShown: true,
          headerLeft: () => <HeaderBack />,
          headerTitle: () => <HeaderTitle title="Dashboard" />,
          drawerIcon: ({ color, size }) => (
            <DrawerIcon
              icon="grid-outline"
              iconPack="ionicons"
              name="Dashboard"
            />
          ),
        }}
      />

      <Drawer.Screen
        name="settings"
        options={{
          title: "",
          headerShown: true,
          headerLeft: () => <HeaderBack />,
          headerTitle: () => <HeaderTitle title="Settings" />,
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
