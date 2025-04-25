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
      <View className="mb-4 px-8 flex-row items-center justify-between">
        <Text className="font-inter-bold text-2xl">{title}</Text>

        <TouchableOpacity
          onPress={route}
          className="p-2 mr-[-8px] flex-row items-center gap-x-2"
        >
          <Text className="text-sm font-inter-bold text-subtext">View All</Text>
          <Ionicons name="chevron-forward" size={15} color={COLORS.subtext} />
        </TouchableOpacity>
      </View>

      <View className="mb-8">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {children}

          <TouchableOpacity
            onPress={route}
            activeOpacity={0.5}
            className="p-5 mr-8 justify-center items-center"
          >
            <Text className="font-inter-bold mb-2 text-sm text-subtext">
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
