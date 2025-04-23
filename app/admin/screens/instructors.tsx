import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import IonicButton from "@/components/common/buttons/IonicButton";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";
import { useInstructorStore } from "@/store/useInstructorStore";
import AddInstructorModal from "@/components/admin/AddInstructorModal";

const Instructors = () => {
  const { instructors, fetchInstructors } = useInstructorStore();
  const [showModal, setShowModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchInstructors();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchInstructors();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      className="flex-1 bg-white px-8"
    >
      <AddInstructorModal showModal={showModal} setShowModal={setShowModal} />

      <View className="mb-6 flex-row justify-between items-center">
        <Text className="font-inter-bold text-xl">Instructors</Text>
        <IonicButton
          onPress={() => setShowModal(true)}
          icon="add"
          label="Add Instructor"
          size={16}
          className="mr-[-8px]"
        />
      </View>

      <View className="mb-8 flex-row gap-x-2 items-center">
        <View className="relative flex-1">
          <TextInput
            className="border border-border pl-14 pr-5 py-4 font-inter rounded-lg"
            placeholder="Search"
          />
          <Ionicons
            name="search"
            size={20}
            className="absolute top-1/2 -translate-y-1/2 left-5"
            color={COLORS.subtext}
          />
        </View>

        <TouchableOpacity className="items-center h-full pl-3 flex-row">
          <Ionicons name="filter" size={21} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView className="space-y-4">
        {instructors.map((instructor) => (
          <View
            key={instructor.id}
            className="flex-row justify-between border-b border-border pb-5 mb-5"
          >
            <View className="flex-row gap-x-5">
              <Image
                source={{ uri: instructor?.photoURL }}
                className="size-14 rounded-full mb-2"
                resizeMode="contain"
              />

              <View>
                <Text className="mb-2 font-inter-bold text-lg">
                  {instructor.firstName} {instructor.lastName}
                </Text>
                <Text className="text-subtext font-inter">
                  ID: {instructor.employeeId}
                </Text>
              </View>
            </View>

            <IonicButton
              icon="ellipsis-vertical"
              size={20}
              className="absolute right-0 mr-[-8px] top-[-8px]"
            />
          </View>
        ))}
      </ScrollView>
    </ScrollView>
  );
};

export default Instructors;
