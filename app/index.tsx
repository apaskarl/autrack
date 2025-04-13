import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  return (
    <View className="items-center justify-center gap-y-5 h-full">
      <Text>app/index.tsx</Text>
      <TouchableOpacity
        onPress={() => router.push("/auth/login")}
        className="flex-row gap-x-2 items-center"
      >
        <Text className="text text-5xl">Enter</Text>
      </TouchableOpacity>
    </View>
  );
}
