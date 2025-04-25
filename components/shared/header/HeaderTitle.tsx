import { View, Text } from "react-native";
import React from "react";

const HeaderTitle = ({ title }: { title?: string }) => {
  return <Text className="font-inter-bold text-xl ml-4">{title}</Text>;
};

export default HeaderTitle;
