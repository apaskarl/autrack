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
    <ScrollView className="p-8 bg-white" showsVerticalScrollIndicator={false}>
      <View className="gap-y-10">
        {/* Header */}
        <View>
          {/* Back button */}
          {!success && (
            <View className="items-start">
              <TouchableOpacity
                onPress={() => router.back()}
                activeOpacity={0.8}
                className="p-1 items-start ml-[-4px]"
              >
                <Ionicons name="chevron-back-outline" size={32} color="black" />
              </TouchableOpacity>
            </View>
          )}

          {/* Title */}
          <View>
            <Text className="font-inter-bold text-2xl mt-4 mb-2">{title}</Text>
            <Text className="font-inter text-subtext leading-relaxed">
              {description}
            </Text>
          </View>
        </View>

        {children}
      </View>
    </ScrollView>
  );
};

export default AuthLayout;
