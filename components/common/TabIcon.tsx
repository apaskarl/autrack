import { View, Text } from "react-native";
import React from "react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

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

export default TabIcon;
