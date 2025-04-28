import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useLayoutEffect } from "react";
import useUserStore from "@/store/useUserStore";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useNavigation } from "expo-router";
import { styles } from "@/styles/styles";
import IonicButton from "@/components/shared/ui/IonicButton";

const Home = () => {
  const { user } = useUserStore();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View className="mr-2">
          <IonicButton icon="menu" size={30} />
        </View>
      ),
    });
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-8 py-5">
          <Text className="text-2xl font-inter-bold mb-5">
            Hello, {user?.firstName}!
          </Text>

          <View
            className="h-[20vh] p-5 rounded-xl bg-light mb-5"
            style={styles.shadow}
          ></View>

          <View className="items-center mb-5">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                router.push({
                  pathname: "/instructor/(tabs)/home/schedule",
                  params: { id: user?.id },
                })
              }
              className="bg-blue px-6 py-3 rounded-full"
            >
              <Text className="text-white font-inter-bold">View Schedules</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-inter-bold mb-5">Rooms</Text>
            <View
              className="font-inter-bold mb-5 px-10 py-5 bg-light rounded-lg"
              style={styles.shadow}
            ></View>
          </View>

          <View
            className="h-[11vh] p-5 rounded-xl bg-light mb-5"
            style={styles.shadow}
          ></View>
          <View
            className="h-[11vh] p-5 rounded-xl bg-light mb-5"
            style={styles.shadow}
          ></View>
          <View
            className="h-[11vh] p-5 rounded-xl bg-light mb-5"
            style={styles.shadow}
          ></View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
