import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";
import FormButton from "@/components/shared/ui/FormButton";
import { COLORS } from "@/constants/colors";

interface FilterModalProps {
  isVisible: boolean;
  onClose: () => void;
  departments: { id: string; name: string }[];
  departmentFilters: string[];
  setDepartmentFilters: (ids: string[]) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  isVisible,
  onClose,
  departments,
  departmentFilters,
  setDepartmentFilters,
}) => {
  const toggleDepartment = (id: string) => {
    if (departmentFilters.includes(id)) {
      setDepartmentFilters(departmentFilters.filter((d) => d !== id));
    } else {
      setDepartmentFilters([...departmentFilters, id]);
    }
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

        <View className="mb-2 flex-row items-center justify-between">
          <Text className="font-inter-bold text-xl">Filter by</Text>
          {departmentFilters.length > 0 && (
            <TouchableOpacity onPress={() => setDepartmentFilters([])}>
              <Text className="border-b font-inter-medium">Clear All</Text>
            </TouchableOpacity>
          )}
        </View>

        {departments.map((department) => (
          <TouchableOpacity
            key={department.id}
            activeOpacity={0.7}
            onPress={() => toggleDepartment(department.id)}
            className="flex-row items-center justify-between rounded-lg py-4"
          >
            <Text
              className={`font-inter ${departmentFilters.includes(department.id) ? "font-inter-medium text-black" : "text-subtext"}`}
            >
              {department.name}
            </Text>

            <View></View>
            <Ionicons
              name="ellipse"
              color={
                departmentFilters.includes(department.id)
                  ? COLORS.primary
                  : COLORS.white
              }
              className={`${departmentFilters.includes(department.id) ? "border-primary" : "border-border"} rounded-full border p-[2px]`}
            />
          </TouchableOpacity>
        ))}

        {/* <View className="mt-1 border-t border-border pt-5">
          <FormButton label="Apply Filters" onPress={onClose} />
        </View> */}
      </View>
    </Modal>
  );
};

export default FilterModal;
