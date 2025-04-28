import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import useUserStore from "@/store/useUserStore";
import InstructorLayout from "@/components/instructor/InstructorLayout";
import ProfileLink from "@/components/instructor/ProfileLink";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import Modal from "react-native-modal";
import Loader from "@/components/shared/ui/Loader";

const Profile = () => {
  const { user, logout } = useUserStore();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state

  const handleLogout = async () => {
    setShowLogoutModal(false);
    setLoading(true); // Show loading indicator
    await logout();
    setLoading(false); // Hide loading indicator after logout is complete
  };

  const [imageLoading, setImageLoading] = useState(true);

  const { colorScheme, toggleColorScheme } = useColorScheme();
  console.log(colorScheme);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <InstructorLayout>
        <View className="items-center gap-y-4 justify-center pt-4 pb-10">
          {imageLoading && (
            <View className="size-28 rounded-full bg-light items-center justify-center">
              <ActivityIndicator size="small" color="#999" />
            </View>
          )}
          <Image
            source={{ uri: user?.photoURL }}
            className={`${
              imageLoading ? "absolute opacity-0" : "relative opacity-100"
            } size-28 rounded-full`}
            resizeMode="contain"
            onLoadStart={() => setImageLoading(true)}
            onLoadEnd={() => setImageLoading(false)}
          />

          <View className="items-center gap-y-1">
            <Text className="font-inter-bold text-xl">
              {user?.firstName} {user?.lastName}
            </Text>
            <Text className="font-inter text-subtext">{user?.email}</Text>
          </View>
        </View>

        <View>
          <ProfileLink
            icon="person-outline"
            label="Edit Profile"
            onPress={() =>
              router.push("/instructor/(tabs)/profile/edit-profile")
            }
          />
          <ProfileLink
            icon="settings-outline"
            label="Settings"
            onPress={() => router.push("/instructor/(tabs)/profile/settings")}
          />
          <ProfileLink
            icon="log-out-outline"
            label="Log Out"
            onPress={() => setShowLogoutModal(true)}
          />
        </View>
      </InstructorLayout>

      <Modal
        isVisible={showLogoutModal}
        onBackButtonPress={() => setShowLogoutModal(false)}
        onBackdropPress={() => setShowLogoutModal(false)}
        animationIn="fadeIn"
        animationOut="fadeOut"
        backdropOpacity={0}
        statusBarTranslucent
        style={{ margin: 0, padding: 0 }}
      >
        <View className="flex-1 justify-center items-center bg-black/50 px-8">
          <View className="bg-white rounded-3xl p-6 w-full">
            <Text className="text-lg font-inter-bold mb-4">Log out</Text>
            <Text className="font-inter-medium mb-6 text-subtext">
              Are you sure you want to log out?
            </Text>
            <View className="flex-row justify-end items-center w-full">
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setShowLogoutModal(false)}
                className="px-5 py-3"
              >
                <Text className="font-inter-medium ">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleLogout}
                className="px-5 py-3 rounded-lg"
              >
                <Text className="font-inter-bold">Log out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Profile;
