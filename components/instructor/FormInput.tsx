import { View, TextInput, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

interface FormInputProps {
  label: string;
  value?: string;
  onChangeText?: (text: string) => void;
  error?: string | null;
}

const FormInput = ({ label, value, onChangeText, error }: FormInputProps) => {
  return (
    <View>
      <Text className="font-inter-semibold mb-3">{label}</Text>

      <View className="relative">
        <TextInput
          className={`${
            error ? "border-red" : "border-border"
          } border rounded-lg p-5 font-inter-medium placeholder:text-subtext`}
          placeholder={`Enter ${label.toLowerCase()}`}
          numberOfLines={1}
          value={value}
          onChangeText={onChangeText}
        />
      </View>

      {error && (
        <Text className="text-red mt-2 font-inter text-sm">
          This field is required.
        </Text>
      )}
    </View>
  );
};

export default FormInput;
