import { View, Text, ScrollView } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const InstructorLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SafeAreaView className="bg-white px-8 flex-1">
      {/* <ScrollView showsVerticalScrollIndicator={false}>{children}</ScrollView> */}
      {children}
    </SafeAreaView>
  );
};

export default InstructorLayout;
