import { View, TextInput, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

interface AuthInputProps {
  label: string;
  password?: boolean;
  email?: boolean;
  value?: string;
  onChangeText?: (text: string) => void;
  error?: string | null;
}

const AuthInput = ({
  label,
  password = false,
  email = false,
  value,
  onChangeText,
  error,
}: AuthInputProps) => {
  const [secure, setSecure] = useState(password);

  return (
    <View>
      <Text className="font-inter-semibold mb-3">
        {label} <Text className="text-red">*</Text>
      </Text>

      <View className="relative">
        <TextInput
          className={`${
            error ? "border-red" : "border-border"
          } border rounded-xl p-5 font-inter-medium`}
          placeholder={`Enter ${label.toLowerCase()}`}
          keyboardType={email ? "email-address" : "default"}
          autoCapitalize={email ? "none" : "sentences"}
          numberOfLines={1}
          secureTextEntry={secure}
          value={value}
          onChangeText={onChangeText}
        />

        {password && (
          <TouchableOpacity
            className="absolute right-2 top-1/2 -translate-y-1/2 p-3"
            onPress={() => setSecure(!secure)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={secure ? "eye-off-outline" : "eye-outline"}
              size={22}
              color="gray"
            />
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Text className="text-red mt-2 font-inter text-sm">
          This field is required.
        </Text>
      )}
    </View>
  );
};

export default AuthInput;
