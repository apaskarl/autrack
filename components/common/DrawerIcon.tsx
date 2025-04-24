import { View, Text } from "react-native";
import React from "react";
import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";

type IconPack = "material" | "ionicons" | "material-community";

const DrawerIcon = ({
  icon,
  name,
  focused,
  iconPack = "ionicons",
}: {
  icon: string;
  name: string;
  focused?: boolean;
  iconPack?: IconPack;
}) => {
  const renderIcon = () => {
    switch (iconPack) {
      case "ionicons":
        return <Ionicons name={icon as any} size={22} color={COLORS.primary} />;
      case "material":
        return (
          <MaterialIcons name={icon as any} size={22} color={COLORS.primary} />
        );
      case "material-community":
        return (
          <MaterialCommunityIcons
            name={icon as any}
            size={22}
            color={COLORS.primary}
          />
        );
      default:
        return <Ionicons name={icon as any} size={22} color={COLORS.primary} />;
    }
  };

  return (
    <View className="flex-row items-center gap-x-4 w-full">
      <View
        className="p-2 rounded-full"
        style={{
          backgroundColor: `${COLORS.primary}20`,
        }}
      >
        {renderIcon()}
      </View>
      <Text className="font-inter-medium text-lg">{name}</Text>
    </View>
  );
};

export default DrawerIcon;
