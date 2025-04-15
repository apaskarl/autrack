import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";
import useUserStore from "@/store/useUserStore";
import InstructorLayout from "@/components/instructor/InstructorLayout";

const Profile = () => {
  const { user, logout } = useUserStore();

  return (
    <InstructorLayout>
      <View className="items-center gap-y-4 justify-center pt-6 pb-14">
        <Image
          source={{ uri: user?.photoURL }}
          className="size-24 rounded-full"
          resizeMode="contain"
        />
        <View className="items-center gap-y-2">
          <Text className="font-inter-bold text-xl">
            {user?.firstName} {user?.lastName}
          </Text>
          <Text className="font-inter text-subtext">{user?.email}</Text>
        </View>
      </View>

      <View>
        <ProfileLink icon="person-outline" label="Profile Information" />
        <ProfileLink icon="settings-outline" label="Settings" />
        <ProfileLink icon="help-outline" label="Help" />
        <ProfileLink icon="document-outline" label="Terms and Conditions" />
        <ProfileLink icon="log-out-outline" label="Log Out" onPress={logout} />
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
