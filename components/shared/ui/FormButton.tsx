// SaveButton.tsx
import React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";

interface FormButtonProps {
  onPress?: () => void;
  loading?: boolean;
  isDisabled?: boolean;
  label: string;
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
        disabled ? "bg-primary/50" : "bg-primary"
      } items-center justify-center rounded-xl p-5`}
      onPress={onPress}
      disabled={disabled}
    >
      <Text className="font-inter-bold text-white">
        {loading ? <ActivityIndicator size="small" color="white" /> : label}
      </Text>
    </TouchableOpacity>
  );
};

export default FormButton;
