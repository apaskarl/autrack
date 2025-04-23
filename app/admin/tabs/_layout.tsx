import React from "react";
import { Tabs } from "expo-router";
import { COLORS } from "@/constants/colors";
import { Platform, Pressable, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

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

type IconPack = "material" | "ionicons";

const TabIcon = ({
  icon,
  color,
  name,
  focused,
  iconPack = "ionicons",
}: {
  icon: string;
  color: string;
  name: string;
  focused?: boolean;
  iconPack?: IconPack;
}) => {
  const renderIcon = () => {
    const size = name === "Scan" ? 30 : 26;
    switch (iconPack) {
      case "ionicons":
        return <Ionicons name={icon as any} size={size} color={color} />;
      case "material":
        return <MaterialIcons name={icon as any} size={size} color={color} />;
      default:
        return <Ionicons name={icon as any} size={size} color={color} />;
    }
  };

  return (
    <View className="items-center justify-center">
      <View>{renderIcon()}</View>

      {name !== "Scan" && (
        <Text
          numberOfLines={1}
          className={`font-inter-bold w-full text-xs`}
          style={{ color: color }}
        >
          {name}
        </Text>
      )}
    </View>
  );
};
