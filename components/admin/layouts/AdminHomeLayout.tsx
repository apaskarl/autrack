import { View, Text } from "react-native";
import React from "react";

const AdminHomeLayout = ({ children }: { children: React.ReactNode }) => {
  return <View className="flex-1 bg-white px-5 py-3">{children}</View>;
};

export default AdminHomeLayout;
