import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import useUserStore from "@/store/useUserStore";
import Loader from "@/components/shared/ui/Loader";

const AdminSettings = () => {
  const { logout } = useUserStore();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await logout();
    setLoading(false);
  };

  if (loading) return <Loader />;

  return (
    <View className="flex-1 bg-white px-5">
      <TouchableOpacity
        onPress={handleLogout}
        activeOpacity={0.8}
        className="w-full items-center rounded-full bg-red p-5"
      >
        <Text className="font-inter-bold text-white">Log out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AdminSettings;
