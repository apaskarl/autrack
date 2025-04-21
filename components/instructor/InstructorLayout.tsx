import { View, Text, ScrollView } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const InstructorLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SafeAreaView className="bg-white flex-1 px-8 pt-8">
      {children}
    </SafeAreaView>
  );
};

export default InstructorLayout;
