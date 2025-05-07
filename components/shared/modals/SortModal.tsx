import React from "react";
import { View, Text } from "react-native";
import Modal from "react-native-modal";
import SortButton from "@/components/shared/ui/SortButton";

type SortOption =
  | "default"
  | "date_asc"
  | "date_desc"
  | "name_asc"
  | "name_desc";

interface SortModalProps {
  isVisible: boolean;
  onClose: () => void;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
}

const SortModal: React.FC<SortModalProps> = ({
  isVisible,
  onClose,
  sortOption,
  setSortOption,
}) => {
  const handleSelect = (option: SortOption) => {
    setSortOption(option);
    onClose();
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={onClose}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropOpacity={0.5}
      statusBarTranslucent
      style={{ justifyContent: "flex-end", margin: 0 }}
    >
      <View className="rounded-t-3xl bg-white px-5 pb-5">
        <View className="my-4 h-1.5 w-20 self-center rounded-full bg-border" />

        <Text className="mb-2 font-inter-bold text-xl">Sort by</Text>
        <SortButton
          label="Default"
          value="default"
          currentSortOption={sortOption}
          onPress={() => handleSelect("default")}
        />
        <SortButton
          label="Date (oldest to latest)"
          value="date_asc"
          currentSortOption={sortOption}
          onPress={() => handleSelect("date_asc")}
        />
        <SortButton
          label="Date (newest to oldest)"
          value="date_desc"
          currentSortOption={sortOption}
          onPress={() => handleSelect("date_desc")}
        />
        <SortButton
          label="Alphabetical (A-Z)"
          value="name_asc"
          currentSortOption={sortOption}
          onPress={() => handleSelect("name_asc")}
        />
        <SortButton
          label="Alphabetical (Z-A)"
          value="name_desc"
          currentSortOption={sortOption}
          onPress={() => handleSelect("name_desc")}
        />
      </View>
    </Modal>
  );
};

export default SortModal;
