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
      <Text className="mb-2 font-inter-bold text-sm">{label}</Text>

      <View className="relative">
        <TextInput
          className={`${
            error ? "border-red" : "border-border"
          } rounded-xl border p-5 font-inter-medium`}
          placeholder={`Enter ${label.toLowerCase()}`}
          numberOfLines={1}
          value={value}
          onChangeText={onChangeText}
        />
      </View>

      {error && (
        <Text className="mt-2 font-inter text-sm text-red">
          This field is required.
        </Text>
      )}
    </View>
  );
};

export default FormInput;
