import {
  View,
  TouchableOpacity,
  TextInput,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from "react-native";
import React, { useRef, useState } from "react";
import { router } from "expo-router";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthButton from "@/components/auth/AuthButton";

const VerifyEmail = () => {
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const inputs = useRef<(TextInput | null)[]>([]);

  const handleChange = (text: string, index: number) => {
    if (/^\d$/.test(text)) {
      const newCode = [...code];
      newCode[index] = text;
      setCode(newCode);
      if (index < 5) {
        inputs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    if (e.nativeEvent.key === "Backspace") {
      const newCode = [...code];
      if (newCode[index]) {
        newCode[index] = "";
      } else if (index > 0) {
        newCode[index - 1] = "";
        inputs.current[index - 1]?.focus();
      }
      setCode(newCode);
    }
  };

  const handlePress = (index: number) => {
    const firstEmpty = code.findIndex((char) => char === "");
    const targetIndex = firstEmpty === -1 ? index : firstEmpty;
    inputs.current[targetIndex]?.focus();
  };

  const renderInputs = () =>
    code.map((digit, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => handlePress(index)}
        activeOpacity={0.8}
      >
        <TextInput
          ref={(ref) => (inputs.current[index] = ref)}
          value={digit}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          keyboardType="numeric"
          maxLength={1}
          className={`${
            digit ? "border-primary" : "border-border"
          } w-14 h-16 border rounded-lg text-center text-2xl font-inter-bold`}
        />
      </TouchableOpacity>
    ));

  return (
    <AuthLayout
      title="Check your email"
      description="We sent a reset link to your email. Enter the 6-digit code that mentioned in the email."
    >
      <View className="gap-y-5">
        <View className="flex-row justify-between">{renderInputs()}</View>

        <AuthButton
          label="Verify Code"
          onPress={() => router.push("/auth/reset/new-password")}
        />
      </View>
    </AuthLayout>
  );
};

export default VerifyEmail;
