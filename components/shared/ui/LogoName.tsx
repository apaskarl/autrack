import { View, Text, Image } from "react-native";
import React from "react";

const LogoName = () => {
  return (
    <View className="flex-row items-center gap-x-2">
      <Image
        source={require("../../../assets/images/logos/logo-outline-primary.png")}
        className="size-10"
        resizeMode="contain"
      />
      <Text className="mt-1 font-inter-extrabold text-2xl tracking-tight">
        AuTrack
      </Text>
    </View>
  );
};

export default LogoName;
