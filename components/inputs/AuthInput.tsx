import { View, TextInput, Text } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

interface AuthInputProps {
  label: string;
  password?: boolean;
}

const AuthInput = ({ label, password = false }: AuthInputProps) => {
  const [secure, setSecure] = useState(password);

  return (
    <View>
      <Text className="font-inter-semibold mb-2">
        {label} <Text className="text-red">*</Text>
      </Text>
      <View className="relative">
        <TextInput
          className="border border-border rounded-lg p-5 font-inter pr-12"
          placeholder={`Enter your ${label.toLowerCase()}`}
          keyboardType={
            label.toLowerCase() === "email" ? "email-address" : "default"
          }
          autoCapitalize="none"
          secureTextEntry={secure}
        />
        {password && (
          <Ionicons
            name={secure ? "eye-off-outline" : "eye-outline"}
            size={22}
            color="gray"
            className="absolute z-50 right-5 top-1/2 -translate-y-1/2"
            onPress={() => setSecure(!secure)}
          />
        )}
      </View>
    </View>
  );
};

export default AuthInput;
