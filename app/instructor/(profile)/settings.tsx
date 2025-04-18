import { View, Text, TextInput } from "react-native";
import React from "react";
import ProfileLink from "@/components/instructor/ProfileLink";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";

const Settings = () => {
  return (
    <View className="flex-1 bg-white px-8">
      <View className="relative mb-3">
        <TextInput
          className="bg-light pl-16 pr-5 py-4 font-inter-semibold rounded-lg"
          placeholder="Search"
        />
        <Ionicons
          name="search-outline"
          size={18}
          className="absolute left-5 top-1/2 -translate-y-1/2"
          color={COLORS.subtext}
        />
      </View>

      <View>
        <ProfileLink icon="notifications-outline" label="Notifications" />
        <ProfileLink icon="eye-outline" label="Appearance" />
        <ProfileLink icon="headset-outline" label="Help and Support" />
        <ProfileLink icon="lock-closed-outline" label="Privacy and Secutiry" />
        <ProfileLink icon="document-outline" label="Terms and Conditions" />
        <ProfileLink icon="help-circle-outline" label="About" />
      </View>
    </View>
  );
};

export default Settings;
