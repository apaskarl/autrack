import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const InstructorLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SafeAreaView className="flex-1 bg-white px-5 pt-8">
      {children}
    </SafeAreaView>
  );
};

export default InstructorLayout;
