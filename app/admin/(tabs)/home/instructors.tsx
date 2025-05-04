import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  RefreshControl,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import React, { useCallback, useLayoutEffect, useState } from "react";
import { router, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";
import { useInstructorStore } from "@/store/useInstructorStore";
import IonicButton from "@/components/shared/ui/IonicButton";
import AdminHomeLayout from "@/components/admin/layouts/AdminHomeLayout";
import AddButton from "@/components/admin/ui/AddButton";
import { styles } from "@/styles/styles";
import Loader from "@/components/shared/ui/Loader";

const AdminInstructors = () => {
  const navigation = useNavigation();
  const { instructors, fetchInstructors, deleteInstructor, loading } =
    useInstructorStore();
  const [refreshing, setRefreshing] = useState(false);
  const [showSearch, setShowSearch] = useState(true);
  const [activeInstructorId, setActiveInstructorId] = useState<string | null>(
    null
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 0);
    await fetchInstructors?.();
  }, [fetchInstructors]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => setShowSearch(true)}
          className="p-3 bg-gray-100 rounded-full"
        >
          <Ionicons name="search" size={18} />
        </TouchableOpacity>
      ),
    });
  }, []);

  return (
    <>
      {loading && (
        <View className="z-50 inset-0 absolute h-screen w-screen opacity-50">
          <Loader />
        </View>
      )}

      <ScrollView
        className="bg-white"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <AdminHomeLayout>
          {showSearch && (
            <View className="relative mb-6">
              <Ionicons
                name="search"
                size={20}
                className="absolute left-6 top-1/2 -translate-y-1/2 rounded-full"
                color={COLORS.subtext}
              />
              <TextInput
                placeholder="Search"
                className="pl-16 pr-5 py-4 border font-inter-medium border-border rounded-full"
              />
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => setShowSearch(false)}
                className="absolute right-5 top-1/2 -translate-y-1/2 p-3 mr-[-8px] rounded-full"
              >
                <Ionicons name="close" size={20} />
              </TouchableOpacity>
            </View>
          )}

          <View className="flex-row gap-x-3 mb-6">
            <TouchableOpacity className="flex-row items-center gap-x-2 border border-border px-4 py-2 rounded-full">
              <Text className="font-inter-medium text-sm">Departments</Text>
              <Ionicons name="caret-down-outline" size={15} />
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center justify-between mb-6">
            {instructors && (
              <Text className="text-sm text-subtext font-inter">
                {instructors.length} instructors
              </Text>
            )}
            <TouchableOpacity className="flex-row items-center gap-x-2">
              <Text className="font-inter-medium text-sm">Sort by</Text>
              <Ionicons name="caret-down-outline" size={15} />
            </TouchableOpacity>
          </View>

          <View>
            {instructors.map((instructor) => (
              <View key={instructor.id} className="relative mb-6">
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() =>
                    router.push({
                      pathname: "/admin/(tabs)/home/instructor-details",
                      params: { id: instructor.id },
                    })
                  }
                  className="flex-row gap-x-4 flex-1"
                >
                  <Image
                    source={{ uri: instructor.image }}
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
                  onPress={() =>
                    setActiveInstructorId(
                      activeInstructorId === instructor.id
                        ? null
                        : instructor.id
                    )
                  }
                  icon="ellipsis-vertical"
                  size={20}
                  className="z-20 absolute right-0 top-0 mr-[-8px]"
                />

                {activeInstructorId === instructor.id && (
                  <View
                    className="z-30 bg-white border border-border/30 rounded-xl absolute right-2 top-10"
                    style={styles.shadow}
                  >
                    <TouchableOpacity
                      activeOpacity={0.5}
                      className="px-5 pb-2 pt-4"
                      onPress={() => {
                        setActiveInstructorId(null);
                        router.push({
                          pathname: "/admin/(tabs)/home/edit-instructor",
                          params: { id: instructor.id },
                        });
                      }}
                    >
                      <Text className="font-inter-medium">Edit instructor</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.5}
                      className="px-5 pb-4 pt-2"
                      onPress={() => {
                        if (!activeInstructorId) return;

                        Alert.alert(
                          "Delete Instructor",
                          `Are you sure you want to remove ${instructor.firstName} ${instructor.lastName} as an insturctor?`,
                          [
                            {
                              text: "Cancel",
                              style: "cancel",
                            },
                            {
                              text: "Delete",
                              onPress: async () => {
                                setActiveInstructorId(null);
                                await deleteInstructor(activeInstructorId);
                              },
                              style: "destructive",
                            },
                          ],
                          { cancelable: true }
                        );
                      }}
                    >
                      <Text className="font-inter-medium">
                        Delete instructor
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </View>
        </AdminHomeLayout>

        {activeInstructorId && (
          <TouchableWithoutFeedback onPress={() => setActiveInstructorId(null)}>
            <View className="z-10 absolute inset-0 h-screen w-screen" />
          </TouchableWithoutFeedback>
        )}
      </ScrollView>

      <AddButton
        label="Add Instructor"
        onPress={() => router.push("/admin/(tabs)/home/add-instructor")}
      />
    </>
  );
};

export default AdminInstructors;
