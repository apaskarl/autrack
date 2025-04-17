import React from "react";
import { Tabs } from "expo-router";
import { COLORS } from "@/constants/colors";
import { Platform, Pressable, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

const EmployeeLayout = () => {
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

      <Tabs.Screen
        name="scan"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <View className="items-center justify-center ">
              <View
                className={`${
                  focused ? "border-black" : "border-border"
                } border mb-2 w-[55px] h-[55px] bg-white rounded-full justify-center items-center`}
                // style={{
                //   elevation: 1,
                // }}
              >
                <Ionicons
                  name="qr-code-outline"
                  size={26}
                  color={COLORS.dark}
                />
              </View>
              <Text
                className="font-inter-bold mb-9 pb-1 text-xs"
                style={{ color: color }}
              >
                QR
              </Text>
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="notifications"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={focused ? "notifications" : "notifications-outline"}
              iconPack="ionicons"
              color={color}
              name="Notifications"
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={focused ? "person" : "person-outline"}
              iconPack="ionicons"
              color={color}
              name="Profile"
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default EmployeeLayout;

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
