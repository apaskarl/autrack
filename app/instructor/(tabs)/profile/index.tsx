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

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <InstructorLayout>
        <View className="items-center justify-center gap-y-4 pb-6">
          {imageLoading && (
            <View className="size-28 items-center justify-center rounded-full bg-light">
              <ActivityIndicator size="small" color="#999" />
            </View>
          )}
          <Image
            source={{ uri: user?.image }}
            className={`${
              imageLoading ? "absolute opacity-0" : "relative opacity-100"
            } size-24 rounded-full`}
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

        <View className="px-2">
          <View className="mb-5">
            <Text className="mb-2 font-inter-semibold text-sm text-primary">
              Activity
            </Text>
            <ProfileLink icon="enter-outline" label="My Requests" />
            <ProfileLink icon="list-outline" label="Room Logs" />
          </View>

          <View className="mb-5">
            <Text className="mb-2 font-inter-semibold text-sm text-primary">
              Account Settings
            </Text>

            <ProfileLink
              icon="create-outline"
              label="Edit Profile"
              onPress={() =>
                router.push("/instructor/(tabs)/profile/edit-profile")
              }
            />
            <ProfileLink
              icon="key-outline"
              label="Change Password"
              onPress={() =>
                router.push("/instructor/(tabs)/profile/change-password")
              }
            />
            <ProfileLink
              icon="notifications-outline"
              label="Notification Preferences"
            />
          </View>

          <View className="mb-5">
            <Text className="mb-2 font-inter-semibold text-sm text-primary">
              Support & Feedback
            </Text>
            <ProfileLink icon="headset-outline" label="Help Center & FAQ" />
            <ProfileLink icon="document-outline" label="Terms & Conditions" />
            <ProfileLink icon="lock-closed-outline" label="Privacy Policy" />
          </View>

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
        <View className="flex-1 items-center justify-center bg-black/50 px-8">
          <View className="w-full rounded-3xl bg-white p-6">
            <Text className="mb-4 font-inter-bold text-lg">Log out</Text>
            <Text className="mb-6 font-inter-medium text-subtext">
              Are you sure you want to log out?
            </Text>
            <View className="w-full flex-row items-center justify-end">
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setShowLogoutModal(false)}
                className="px-5 py-3"
              >
                <Text className="font-inter-medium">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleLogout}
                className="rounded-lg px-5 py-3"
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
