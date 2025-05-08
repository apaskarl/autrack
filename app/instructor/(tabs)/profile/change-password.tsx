import { View, Text, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import InputField from "@/components/shared/ui/InputField";
import FormButton from "@/components/shared/ui/FormButton";
import { auth } from "@/firebase";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import useUserStore from "@/store/useUserStore";
import { router } from "expo-router";

const ChangePassword = () => {
  const { user } = useUserStore();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("Please enter all required fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Password do not match.");
      return;
    }

    setLoading(true);

    try {
      const currentUser = auth.currentUser;

      if (!currentUser || !user?.email) {
        throw new Error("User not authenticated.");
      }

      const credential = EmailAuthProvider.credential(user.email, oldPassword);
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, newPassword);

      Alert.alert("Success", "Password changed successfully.");
      router.back();
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error("Password change error:", error);
      Alert.alert("Error", error.message || "Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-5">
      <View className="gap-y-6">
        {error && (
          <View className="rounded-xl bg-red/10 px-5 py-3">
            <Text className="font-inter-medium text-sm leading-relaxed text-red">
              {error}
            </Text>
          </View>
        )}

        <InputField
          label="Old Password"
          value={oldPassword}
          onChangeText={setOldPassword}
          error={!oldPassword && !!error}
          password
        />
        <InputField
          label="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
          error={!newPassword && !!error}
          password
        />
        <InputField
          label="Confirm New Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          error={!confirmPassword && !!error}
          password
        />
        <FormButton
          label="Change Password"
          onPress={handleChangePassword}
          loading={loading}
        />
      </View>
    </SafeAreaView>
  );
};

export default ChangePassword;
