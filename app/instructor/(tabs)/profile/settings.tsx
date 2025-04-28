import { View, Text, TextInput } from "react-native";
import React from "react";
import ProfileLink from "@/components/instructor/ProfileLink";
import { router } from "expo-router";

const Settings = () => {
  return (
    <View className="flex-1 bg-white px-8">
      <View>
        <ProfileLink icon="notifications-outline" label="Notifications" />
        <ProfileLink
          icon="moon-outline"
          label="Dark Mode"
          onPress={() => router.push("/instructor/(tabs)/profile/appearance")}
        />
        <ProfileLink icon="headset-outline" label="Help and Support" />
        <ProfileLink icon="lock-closed-outline" label="Privacy and Security" />
        <ProfileLink icon="document-outline" label="Terms and Conditions" />
        <ProfileLink icon="help-circle-outline" label="About" />
      </View>
    </View>
  );
};

export default Settings;
