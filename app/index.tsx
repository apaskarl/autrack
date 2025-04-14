import { router } from "expo-router";
import {
  Image,
  ImageSourcePropType,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ICONS } from "@/constants/icons";

export default function Index() {
  return (
    <View className="p-10 bg-white gap-y-16 h-full">
      <View className="flex-row items-center gap-x-2">
        <Image
          source={require("../assets/images/logos/logo-outline-primary.png")}
          className="size-11"
          resizeMode="contain"
        />
        <Text className="text-2xl mt-2 tracking-tight font-inter-bold">
          AuTrack
        </Text>
      </View>

      <View className="gap-y-5">
        <Text className="text-center font-inter-medium text-subtext">
          Log in as
        </Text>

        <Button
          label="Admin"
          source={ICONS.admin}
          onPress={() => router.push("/auth/login")}
        />
        <Button
          label="Instructor"
          source={ICONS.employee}
          onPress={() => router.push("/auth/login")}
        />
      </View>

      <Text className="font-inter-medium text-center text-subtext">
        Need help?{" "}
        <Text className="text-primary underline font-inter-bold">Click Me</Text>
      </Text>
    </View>
  );
}

const Button = ({
  label,
  source,
  onPress,
}: {
  label: string;
  source: ImageSourcePropType;
  onPress?: () => void;
}) => {
  return (
    <View className="relative">
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.5}
        className="border border-border w-full rounded-lg p-5"
      >
        <Text className="text-center text-lg font-inter-bold">{label}</Text>
      </TouchableOpacity>
      {source && (
        <View className="absolute left-5 top-1/2 -translate-y-1/2">
          <Image source={source} className="size-8" resizeMode="contain" />
        </View>
      )}
    </View>
  );
};
