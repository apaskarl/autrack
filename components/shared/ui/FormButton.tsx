// SaveButton.tsx
import React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";

interface FormButtonProps {
  onPress: () => void;
  loading?: boolean;
  isDisabled?: boolean;
  label?: string;
}

const FormButton = ({
  onPress,
  loading = false,
  isDisabled = false,
  label,
}: FormButtonProps) => {
  const disabled = loading || isDisabled;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className={`${
        disabled ? "bg-blue/50" : "bg-blue"
      } p-5 rounded-xl items-center justify-center`}
      onPress={onPress}
      disabled={disabled}
    >
      <Text className="text-white font-inter-bold">
        {loading ? <ActivityIndicator size="small" color="white" /> : label}
      </Text>
    </TouchableOpacity>
  );
};

export default FormButton;
