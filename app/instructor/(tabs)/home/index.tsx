import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import useUserStore from "@/store/useUserStore";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

const Home = () => {
  const { user } = useUserStore();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-8 py-5">
          <Text className="text-2xl font-inter-bold mb-5">
            Welcome back, {user?.firstName}
          </Text>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              router.push({
                pathname: "/instructor/(tabs)/home/schedule",
                params: { id: user?.id },
              })
            }
            className="bg-blue px-6 py-3 self-start rounded-full"
          >
            <Text className="text-white font-inter-bold">View Schedules</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
