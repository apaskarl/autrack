import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: boolean;
  numeric?: boolean;
  email?: boolean;
  password?: boolean;
}

const InputField = ({
  label,
  value,
  onChangeText,
  error,
  numeric,
  email,
  password,
}: InputFieldProps) => {
  const [secure, setSecure] = useState(password);

  return (
    <View className="flex-1">
      <Text className="mb-2 font-inter-bold text-sm">{label}</Text>

      <View className="relative">
        <TextInput
          placeholder={label}
          value={value}
          onChangeText={(text) =>
            numeric
              ? onChangeText(text.replace(/[^0-9]/g, ""))
              : onChangeText(text)
          }
          keyboardType={
            numeric ? "numeric" : email ? "email-address" : "default"
          }
          autoCapitalize={email ? "none" : "sentences"}
          secureTextEntry={secure}
          className={`${
            error ? "border-red" : "border-border"
          } rounded-xl border p-5 font-inter-medium`}
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
        <Text className="mt-2 font-inter-medium text-sm text-red">
          This field is required.
        </Text>
      )}
    </View>
  );
};

export default InputField;
