import { View, TextInput, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

interface AuthInputProps {
  label: string;
  password?: boolean;
  email?: boolean;
}

const AuthInput = ({
  label,
  password = false,
  email = false,
}: AuthInputProps) => {
  const [secure, setSecure] = useState(password);

  return (
    <View>
      <Text className="font-inter-semibold mb-2">
        {label} <Text className="text-red">*</Text>
      </Text>
      <View className="relative">
        <TextInput
          className={`border border-border rounded-lg p-5 font-inter-medium`}
          placeholder={`Enter ${label.toLowerCase()}`}
          keyboardType={email ? "email-address" : "default"}
          autoCapitalize="none"
          numberOfLines={1}
          secureTextEntry={secure}
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
    </View>
  );
};

export default AuthInput;
