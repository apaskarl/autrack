import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
}

const SearchInput = ({ value, onChangeText }: SearchInputProps) => {
  return (
    <View className="relative w-full">
      <Ionicons
        name="search"
        size={20}
        className="absolute left-6 top-1/2 z-10 -translate-y-1/2 rounded-full"
        color={COLORS.subtext}
      />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search"
        className={`rounded-full border border-border bg-light py-4 pl-16 pr-5 font-inter-medium`}
      />

      {value && (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => onChangeText("")}
          className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full p-4"
        >
          <Ionicons name="close" size={22} color={COLORS.subtext} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchInput;
