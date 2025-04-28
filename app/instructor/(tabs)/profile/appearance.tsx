import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const options = ["On", "Off", "Use System Settings"];

const DarkModeSettings = () => {
  const [selectedOption, setSelectedOption] = useState("Use System Settings");

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            onPress={() => setSelectedOption(option)}
            activeOpacity={0.5}
            className="flex-row px-8 justify-between items-center py-3"
          >
            <Text className="text-base font-inter-semibold">{option}</Text>

            <View
              className={`w-5 h-5 rounded-full border-2 mr-3 ${
                selectedOption === option ? "border-blue" : "border-gray-500"
              } items-center justify-center`}
            >
              {selectedOption === option && (
                <View className="w-2.5 h-2.5 rounded-full bg-blue" />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default DarkModeSettings;
