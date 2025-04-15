import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  success?: boolean;
}

const AuthLayout = ({
  children,
  title,
  description,
  success = false,
}: AuthLayoutProps) => {
  return (
    <SafeAreaView className="bg-white px-8 min-h-full">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="gap-y-10 py-5">
          {/* Header */}
          <View className="gap-y-4">
            {/* Back button */}
            {!success && (
              <View className="items-start">
                <TouchableOpacity
                  onPress={() => router.back()}
                  activeOpacity={0.8}
                  className="p-1 items-start ml-[-8px]"
                >
                  <Ionicons
                    name="chevron-back-outline"
                    size={32}
                    color="black"
                  />
                </TouchableOpacity>
              </View>
            )}

            {/* Title */}
            <View>
              <Text className="font-inter-bold text-2xl mb-2">{title}</Text>
              <Text className="font-inter text-subtext leading-relaxed">
                {description}
              </Text>
            </View>
          </View>

          {children}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AuthLayout;
