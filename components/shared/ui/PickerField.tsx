import React from "react";
import { Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";

interface PickerOption {
  label: string;
  value: string;
}

interface PickerFieldProps {
  title: string;
  selectedValue: string;
  onValueChange: (value: string) => void;
  options: PickerOption[];
  error?: boolean;
}

const PickerField: React.FC<PickerFieldProps> = ({
  selectedValue,
  onValueChange,
  options,
  title,
  error,
}) => {
  return (
    <View>
      <Text className="mb-2 font-inter-bold text-sm">{title}</Text>
      <View
        className={`${
          error ? "border-red" : "border-border"
        } rounded-xl border`}
      >
        <Picker selectedValue={selectedValue} onValueChange={onValueChange}>
          <Picker.Item label={title} value="" />
          {options.map((option) => (
            <Picker.Item
              key={option.value}
              label={option.label}
              value={option.value}
            />
          ))}
        </Picker>
      </View>
      {error && (
        <Text className="mt-2 font-inter-medium text-sm text-red">
          This field is required.
        </Text>
      )}
    </View>
  );
};

export default PickerField;
