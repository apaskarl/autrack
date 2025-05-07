import { View, Text } from "react-native";
import React from "react";

const HeaderTitle = ({ title }: { title?: string }) => {
  return <Text className="ml-2 mt-1 font-inter-bold text-xl">{title}</Text>;
};

export default HeaderTitle;
