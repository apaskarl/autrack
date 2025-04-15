import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import InstructorLayout from "@/components/instructor/InstructorLayout";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";
import { auth } from "@/firebase";
import { signOut } from "firebase/auth";
import { router } from "expo-router";

const Profile = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/auth/login");
      router.dismissAll();
    } catch (error: any) {
      console.error("Logout Error:", error.message);
    }
  };

  return (
    <InstructorLayout>
      <View className="items-center gap-y-4 justify-center pt-6 pb-14">
        <Image
          source={require("../../assets/images/users/user.jpg")}
          className="size-24 rounded-full"
          resizeMode="contain"
        />

        <View className="items-center gap-y-2">
          <Text className="font-inter-bold text-xl">John Doe</Text>
          <Text className="font-inter text-subtext">example@mail.com</Text>
        </View>
      </View>

      <View>
        <ProfileLink icon="person-outline" label="Profile Information" />
        <ProfileLink icon="settings-outline" label="Settings" />
        <ProfileLink icon="help-outline" label="Help" />
        <ProfileLink icon="document-outline" label="Terms and Conditons" />
        <ProfileLink
          icon="log-out-outline"
          label="Log Out"
          onPress={handleLogout}
        />
      </View>
    </InstructorLayout>
  );
};

export default Profile;

const ProfileLink = ({
  icon,
  label,
  onPress,
}: {
  icon: string;
  label: string;
  onPress?: () => void;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.5}
      className="flex-row py-4 items-center justify-between"
    >
      <View className="flex-row items-center gap-x-5">
        <Ionicons name={icon as any} size={24} color="black" />
        <Text className="font-inter-semibold">{label}</Text>
      </View>

      <Ionicons
        name="chevron-forward-outline"
        size={20}
        color={COLORS.subtext}
      />
    </TouchableOpacity>
  );
};
