import { View, Text, Image } from "react-native";
import React from "react";
import { IMAGES } from "@/constants/images";

const NoResultsFound = () => {
  return (
    <View className="mt-4 items-center justify-center">
      <Image source={IMAGES.nothingHere} resizeMode="contain" />
      <Text className="mt-2 text-center font-inter text-sm text-subtext">
        No results found
      </Text>
    </View>
  );
};

export default NoResultsFound;
