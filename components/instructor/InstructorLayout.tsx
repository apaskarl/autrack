import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const InstructorLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SafeAreaView className="bg-white p-8 flex-1">{children}</SafeAreaView>
  );
};

export default InstructorLayout;
