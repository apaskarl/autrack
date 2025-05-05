import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";

const CardContainer = ({
  title,
  route,
  children,
}: {
  title: string;
  route?: () => void;
  children: React.ReactNode;
}) => {
  return (
    <>
      <View className="mb-4 flex-row items-center justify-between px-6">
        <Text className="font-inter-bold text-2xl">{title}</Text>

        <TouchableOpacity
          onPress={route}
          className="mr-[-8px] flex-row items-center gap-x-2 p-2"
        >
          <Text className="font-inter-bold text-sm text-subtext">View All</Text>
          <Ionicons name="chevron-forward" size={15} color={COLORS.subtext} />
        </TouchableOpacity>
      </View>

      <View className="mb-6">
        <ScrollView
          className="pb-1"
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {children}

          <TouchableOpacity
            onPress={route}
            activeOpacity={0.5}
            className="mr-8 items-center justify-center p-5"
          >
            <Text className="mb-2 font-inter-bold text-sm text-subtext">
              View All
            </Text>
            <Ionicons name="arrow-forward" size={20} color={COLORS.subtext} />
          </TouchableOpacity>
        </ScrollView>
      </View>
    </>
  );
};

export default CardContainer;
