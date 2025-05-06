import { Text, View } from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import AuthInput from "@/components/auth/AuthInput";
import AuthButton from "@/components/auth/AuthButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "@/firebase"; // Ensure your Firebase config is correctly imported
import { sendPasswordResetEmail } from "firebase/auth"; // Firebase reset password method

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const handleResetPassword = async () => {
    if (!email) {
      setError("Please enter your email.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess("Password reset email sent. Please check your inbox.");
    } catch (err: any) {
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 gap-y-5 bg-white px-5">
      <Text className="font-inter leading-relaxed text-subtext">
        Please enter your email to reset the password.
      </Text>

      {error && (
        <View className="rounded-xl bg-red/10 px-5 py-3">
          <Text className="font-inter-medium text-sm leading-relaxed text-red">
            {error}
          </Text>
        </View>
      )}

      {success && (
        <View className="rounded-xl bg-green/10 px-5 py-3">
          <Text className="font-inter-medium text-sm leading-relaxed text-green">
            {success}
          </Text>
        </View>
      )}

      <AuthInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        error={!email && !!error}
        email
      />

      <AuthButton
        label="Send Reset Password Link"
        onPress={handleResetPassword}
        disabled={loading}
      />
    </SafeAreaView>
  );
};

export default ForgotPassword;
