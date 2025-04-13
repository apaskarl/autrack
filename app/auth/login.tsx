import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { router } from "expo-router";
import AuthInput from "@/components/inputs/AuthInput";
import AuthButton from "@/components/buttons/AuthButton";

const LogIn = () => {
  // Handle login logic here
  const handleLogin = () => {};

  return (
    <View className="bg-white p-8 h-full">
      <View className="h-full justify-between py-10">
        <View className="items-center gap-y-4">
          <Image
            source={require("../../assets/images/logos/autrack-logo.png")}
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

        <View className="gap-y-5 pb-20">
          <AuthInput label="Email" />

          <AuthInput label="Password" password />

          <View className="flex-row items-center justify-between ">
            {/* Display the error message of the password here */}
            <Text className="font-inter text-subtext">Error here</Text>
            <TouchableOpacity
              onPress={() => router.push("/auth/forgot-password")}
              activeOpacity={0.8}
            >
              <Text className="font-inter-semibold">Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <AuthButton label="Log In" onPress={handleLogin} />
        </View>

        <Text className="text-center leading-relaxed px-5 font-inter text-subtext">
          By logging in, you agree to the{" "}
          <Text className="text-black font-inter-semibold">
            Terms of Service
          </Text>{" "}
          and{" "}
          <Text className="text-black font-inter-semibold">
            Data Processing Agreement
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default LogIn;
