import {
  View,
  Text,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import AuthInput from "@/components/auth/AuthInput";
import AuthButton from "@/components/auth/AuthButton";
import { SafeAreaView } from "react-native-safe-area-context";
import useUserStore from "@/store/useUserStore";

const LogIn = () => {
  const { login } = useUserStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    setLoading(true);
    const { email, password } = formData;

    try {
      await login(email, password);
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
          <View className="py-24 gap-y-16 justify-center w-full">
            <View className="items-center gap-y-4">
              <Image
                source={require("../../assets/images/logos/logo-outline-primary.png")}
                className="size-16"
                resizeMode="contain"
              />
              <Text className="font-inter-bold leading-relaxed text-4xl px-5 text-center">
                Log in to your account
              </Text>
              <Text className="font-inter text-subtext">
                Enter your email and password to log in
              </Text>
            </View>

            <View className="gap-y-5">
              <AuthInput
                label="Email"
                email
                value={formData.email}
                onChangeText={(text) => handleChange("email", text)}
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
