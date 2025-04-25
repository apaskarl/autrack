import { View, Text, Touchable, TouchableOpacity } from "react-native";
import React from "react";
import useUserStore from "@/store/useUserStore";

const AdminSettings = () => {
  const { logout } = useUserStore();
  return (
    <View className="flex-1 bg-white justify-center items-center">
      <TouchableOpacity onPress={logout}>
        <Text>Log out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AdminSettings;
