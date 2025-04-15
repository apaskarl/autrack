// components/auth/AuthInput.tsx (if you need to modify the input type)
// No changes needed if it already supports both text and email input types

// screens/auth/LogIn.tsx
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import { router } from "expo-router";
import AuthInput from "@/components/auth/AuthInput";
import AuthButton from "@/components/auth/AuthButton";
import useUserStore from "@/store/useUserStore";

const LogIn = () => {
  const { login } = useUserStore();
  const [formData, setFormData] = useState({
    emailOrId: "", // Changed from 'email' to 'emailOrId'
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    setLoading(true);
    const { emailOrId, password } = formData;

    try {
      await login(emailOrId, password);
    } catch (err) {
      // Error already handled in store
    }

    setLoading(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-8">
      <KeyboardAvoidingView className="flex-1">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View className="pb-24 pt-28 gap-y-16 justify-center w-full">
            <View className="items-center gap-y-2">
              <Image
                source={require("../../assets/images/logos/logo-outline-primary.png")}
                className="size-20"
                resizeMode="contain"
              />
              <View className="gap-y-4">
                <Text className="font-inter-bold leading-relaxed text-4xl px-5 text-center">
                  Log In
                </Text>
                <Text className="font-inter text-subtext">
                  Please enter your email and password to log in
                </Text>
              </View>
            </View>

            <View className="gap-y-5">
              <AuthInput
                label="Email or ID Number"
                email
                value={formData.emailOrId}
                onChangeText={(text) => handleChange("emailOrId", text)}
              />

              <AuthInput
                label="Password"
                password
                value={formData.password}
                onChangeText={(text) => handleChange("password", text)}
              />

              <View className="items-end">
                <TouchableOpacity
                  onPress={() => router.push("/auth/reset/forgot-password")}
                  activeOpacity={0.8}
                >
                  <Text className="font-inter-semibold text-primary underline">
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </View>

              <AuthButton
                label={loading ? "Logging in..." : "Log In"}
                onPress={handleLogin}
                disabled={loading}
              />
            </View>

            <View className="flex-row items-center gap-x-1 justify-center">
              <Text className="font-inter text-subtext">No account?</Text>
              <TouchableOpacity
                onPress={() => router.push("/auth/register/register")}
                activeOpacity={0.8}
              >
                <Text className="font-inter-semibold text-primary underline">
                  Register here
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LogIn;
