import React from "react";
import { Tabs } from "expo-router";
import { COLORS } from "@/constants/colors";
import { Platform, Pressable } from "react-native";
import TabIcon from "@/components/shared/ui/TabIcon";

const AdminTabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: COLORS.dark,
        tabBarInactiveTintColor: COLORS.border,
        tabBarStyle: {
          borderTopColor: COLORS.light,
          height: Platform.OS === "ios" ? 85 : 65,
          paddingTop: 8,
        },
        tabBarButton: (props) => (
          <Pressable {...props} android_ripple={{ color: "transparent" }} />
        ),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={focused ? "home" : "home-outline"}
              iconPack="ionicons"
              color={color}
              name="Home"
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="messages"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={focused ? "chatbox-ellipses" : "chatbox-ellipses-outline"}
              iconPack="ionicons"
              color={color}
              name="Messages"
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default AdminTabsLayout;
