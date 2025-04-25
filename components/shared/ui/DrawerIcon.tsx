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
        return <Ionicons name={icon as any} size={22} color={COLORS.black} />;
      case "material":
        return (
          <MaterialIcons name={icon as any} size={22} color={COLORS.black} />
        );
      case "material-community":
        return (
          <MaterialCommunityIcons
            name={icon as any}
            size={22}
            color={COLORS.black}
          />
        );
      default:
        return <Ionicons name={icon as any} size={22} color={COLORS.primary} />;
    }
  };

  return (
    <View className="flex-row items-center py-1 gap-x-5 w-full">
      <View>{renderIcon()}</View>
      <Text className="font-inter-semibold text-lg">{name}</Text>
    </View>
  );
};

export default DrawerIcon;
