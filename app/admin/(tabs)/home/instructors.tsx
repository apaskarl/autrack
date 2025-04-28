import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  RefreshControl,
} from "react-native";
import React, { useCallback, useLayoutEffect, useState } from "react";
import { router, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";
import { useInstructorStore } from "@/store/useInstructorStore";
import IonicButton from "@/components/shared/ui/IonicButton";
import AdminHomeLayout from "@/components/admin/layouts/AdminHomeLayout";
import AddInstructorModal from "@/components/admin/feedback/AddInstructorModal";

const AdminInstructors = () => {
  const navigation = useNavigation();
  const { instructors, fetchInstructors } = useInstructorStore();
  const [showModal, setShowModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchInstructors?.();
    setRefreshing(false);
  }, [fetchInstructors]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity className="flex-row items-center gap-x-2 pr-4">
          <Ionicons name="search" size={20} />
        </TouchableOpacity>
      ),
    });
  }, []);

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <AdminHomeLayout>
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

          <View>
            {instructors.map((instructor, index) => (
              <View
                key={instructor.id}
                className={`${
                  index !== instructors.length - 1
                    ? "border-b border-border mb-5"
                    : ""
                } relative flex-row justify-between pb-5`}
              >
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/admin/(tabs)/home/instructor-details",
                      params: { id: instructor.id },
                    })
                  }
                  className="flex-row gap-x-4 flex-1"
                >
                  <Image
                    source={{ uri: instructor?.photoURL }}
                    className="size-16 rounded-full"
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
                </TouchableOpacity>

                <IonicButton
                  icon="ellipsis-vertical"
                  size={20}
                  className="absolute right-0 mr-[-8px] top-[-8px]"
                />
              </View>
            ))}
          </View>
        </AdminHomeLayout>
      </ScrollView>

      <TouchableOpacity
        onPress={() => setShowModal(true)}
        activeOpacity={0.7}
        className="flex-row items-center gap-x-2 bg-blue px-5 py-4 absolute bottom-5 right-5 rounded-full"
        style={{ elevation: 4 }}
      >
        <Ionicons name="add" size={16} color="white" />
        <Text className="font-inter-bold text-white">Add Instructor</Text>
      </TouchableOpacity>

      <AddInstructorModal showModal={showModal} setShowModal={setShowModal} />
    </>
  );
};

export default AdminInstructors;
