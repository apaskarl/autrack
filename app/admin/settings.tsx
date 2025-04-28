import { View, Text, Touchable, TouchableOpacity } from "react-native";
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
    <View className="flex-1 bg-white justify-center items-center">
      <TouchableOpacity onPress={handleLogout}>
        <Text>Log out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AdminSettings;
