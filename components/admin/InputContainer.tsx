import { View, Text } from "react-native";
import React from "react";

const InputContainer = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <View className="">
      <Text className="font-inter-semibold text-sm mb-2">{title}</Text>
      {children}
    </View>
  );
};

export default InputContainer;
