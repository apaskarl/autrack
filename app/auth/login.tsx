import {
  View,
  Text,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import AuthInput from "@/components/auth/AuthInput";
import AuthButton from "@/components/auth/AuthButton";

const LogIn = () => {
  const { role } = useLocalSearchParams();
  const isAdmin = role === "admin";
  const isInstructor = role === "instructor";

  const handleLogin = () => {
    if (isAdmin) {
      router.push("/admin/home");
    } else if (isInstructor) {
      router.push("/instructor/home");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="bg-white h-full p-8"
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="flex-1 items-center">
          <View className="gap-y-28 mt-10 h-[85%]  w-full">
            <View className="items-center gap-y-4">
              <Image
                source={require("../../assets/images/logos/logo-outline-primary.png")}
                className="size-16"
                resizeMode="contain"
              />
              <Text className="font-inter-bold  text-4xl px-5 text-center">
                Log in to your account
              </Text>
              <Text className="font-inter text-subtext">
                Enter your email and password to log in
              </Text>
            </View>

            <View className="gap-y-5">
              <AuthInput label="Email" email />

              <AuthInput label="Password" password />

              <View className="flex-row items-center justify-between ">
                <Text className="font-inter text-subtext">Error here</Text>
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
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LogIn;
