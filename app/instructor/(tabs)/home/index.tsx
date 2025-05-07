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
        <View className="px-5 py-5">
          <View
            className="mb-6 h-[20vh] rounded-xl bg-light p-5"
            style={styles.shadow}
          ></View>

          <View className="mb-5 items-center">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                router.push({
                  pathname: "/instructor/(tabs)/home/schedule",
                  params: { id: user?.id },
                })
              }
              className="rounded-full bg-blue px-6 py-3"
            >
              <Text className="font-inter-bold text-white">View Schedules</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
