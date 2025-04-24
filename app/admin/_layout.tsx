import { Drawer } from "expo-router/drawer";
import { COLORS } from "@/constants/colors";
import DrawerIcon from "@/components/common/DrawerIcon";

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerType: "slide",
        drawerActiveTintColor: COLORS.black,
        drawerInactiveTintColor: COLORS.black,
        drawerActiveBackgroundColor: "transparent",
        drawerStyle: {
          width: 270,
          paddingTop: 25,
        },
      }}
    >
      <Drawer.Screen
        name="tabs"
        options={{
          title: "",
          drawerIcon: ({ color, size }) => (
            <DrawerIcon icon="home-outline" iconPack="ionicons" name="Home" />
          ),
        }}
      />

      <Drawer.Screen
        name="screens/rooms"
        options={{
          title: "",
          drawerIcon: ({ color, size }) => (
            <DrawerIcon
              icon="door-closed"
              iconPack="material-community"
              name="Rooms"
            />
          ),
        }}
      />

      <Drawer.Screen
        name="screens/instructors"
        options={{
          title: "",
          drawerIcon: ({ color, size }) => (
            <DrawerIcon
              icon="people-outline"
              iconPack="ionicons"
              name="Instructors"
            />
          ),
        }}
      />
    </Drawer>
  );
}
