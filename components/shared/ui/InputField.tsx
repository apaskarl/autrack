import React from "react";
import { Text, TextInput, View } from "react-native";

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: boolean;
  numeric?: boolean;
}

const InputField = ({
  label,
  value,
  onChangeText,
  error,
  numeric,
}: InputFieldProps) => {
  return (
    <View className="flex-1">
      <Text className="text-sm font-inter-bold mb-2">{label}</Text>
      <TextInput
        placeholder={label}
        value={value}
        onChangeText={(text) =>
          numeric
            ? onChangeText(text.replace(/[^0-9]/g, ""))
            : onChangeText(text)
        }
        keyboardType={numeric ? "numeric" : "default"}
        className={`${
          error ? "border-red" : "border-border"
        } border rounded-xl p-5 font-inter-medium`}
      />
      {error && (
        <Text className="text-xs text-red font-inter-medium mt-2">
          This field is required.
        </Text>
      )}
    </View>
  );
};

export default InputField;
