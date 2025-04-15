import {
  View,
  Text,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import AuthInput from "@/components/auth/AuthInput";
import AuthButton from "@/components/auth/AuthButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "@/firebase";

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { role } = useLocalSearchParams();
  const isAdmin = role === "admin";
  const isInstructor = role === "instructor";

  const handleLogin = () => {
    router.push("/instructor/home");
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-8">
      <KeyboardAvoidingView className="flex-1">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View className="gap-y-28 h-full pt-5 w-full">
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
              <AuthInput label="Email" email />

              <AuthInput label="Password" password />

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

              <AuthButton label="Log In" onPress={handleLogin} />
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
