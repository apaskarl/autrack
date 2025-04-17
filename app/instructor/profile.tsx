import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import useUserStore from "@/store/useUserStore";
import InstructorLayout from "@/components/instructor/InstructorLayout";
import ProfileLink from "@/components/instructor/ProfileLink";

const Profile = () => {
  const { user, logout } = useUserStore();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(false);
    logout();
  };

  return (
    <InstructorLayout>
      <View className="items-center gap-y-4 justify-center pt-6 pb-14">
        <Image
          source={{ uri: user?.photoURL }}
          className="size-20 rounded-full"
          resizeMode="contain"
        />
        <View className="items-center gap-y-1">
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
        <ProfileLink
          icon="log-out-outline"
          label="Log Out"
          onPress={() => setShowLogoutModal(true)}
        />
      </View>

      {/* Logout Confirmation Modal */}
      <Modal
        transparent
        visible={showLogoutModal}
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50 px-8">
          <View className="bg-white rounded-3xl p-5 w-full max-w-md items-center">
            <Text className="text-lg font-inter-bold mb-4">Confirm</Text>
            <Text className="text-center font-inter mb-6 text-subtext">
              Are you sure you want to log out?
            </Text>
            <View className="flex-row justify-between w-full">
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setShowLogoutModal(false)}
                className="flex-1 p-2 border-r border-border items-center"
              >
                <Text className="font-inter-medium">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleLogout}
                className="flex-1 p-2 items-center"
              >
                <Text className="font-inter-semibold">Log out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </InstructorLayout>
  );
};

export default Profile;
