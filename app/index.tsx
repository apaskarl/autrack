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
import useUserStore from "@/store/useUserStore";
import AuthInput from "@/components/auth/AuthInput";
import AuthButton from "@/components/auth/AuthButton";

const Index = () => {
  const { login } = useUserStore();

  // Separate states for emailOrId and password
  const [emailOrId, setEmailOrId] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!emailOrId || !password) {
      setError("Please enter all required fields.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const emailOrIdTrimmed = emailOrId.trim();
      const passwordTrimmed = password.trim();

      await login(emailOrIdTrimmed, passwordTrimmed);
    } catch (err: any) {
      if (
        err.message.includes("No user found") ||
        err.message.includes("invalid") ||
        err.message.includes("wrong")
      ) {
        setError("Invalid email/ID number or password.");
        setPassword("");
      } else if (err.message.includes("Please verify your email address")) {
        setError(
          "Please verify your email address. Check your inbox for the verification link.",
        );
      } else {
        setError("Something went wrong. Please try again later.");
        setPassword("");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-5">
      <KeyboardAvoidingView className="flex-1">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View className="h-[90vh] w-full justify-center gap-y-16">
            <View className="items-center">
              <Image
                source={require("../assets/images/logos/logo-outline-primary.png")}
                className="mb-4 size-20"
                resizeMode="contain"
              />
              <Text className="mb-3 px-8 text-center font-inter-bold text-4xl leading-[45px]">
                Sign in to your account
              </Text>
              <Text className="font-inter text-subtext">
                Enter your email and password to log in
              </Text>
            </View>

            <View className="gap-y-5">
              {error && (
                <View className="rounded-xl bg-red/10 px-5 py-3">
                  <Text className="font-inter-medium text-sm leading-relaxed text-red">
                    {error}
                  </Text>
                </View>
              )}

              <AuthInput
                label="Email or ID Number"
                email
                value={emailOrId}
                onChangeText={setEmailOrId}
                error={!emailOrId && !!error}
              />

              <AuthInput
                label="Password"
                password
                value={password}
                onChangeText={setPassword}
                error={!password && !!error}
              />

              <View className="items-end">
                <TouchableOpacity
                  onPress={() => router.push("/auth/reset/forgot-password")}
                  activeOpacity={0.8}
                >
                  <Text className="font-inter-bold text-primary underline">
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </View>

              <AuthButton
                label={loading ? "" : "Log In"}
                onPress={handleLogin}
                disabled={loading}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Index;
