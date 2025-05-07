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
import React, { useCallback, useEffect, useState } from "react";
import { router } from "expo-router";
import { COLORS } from "@/constants/colors";
import { useInstructorStore } from "@/store/useInstructorStore";
import IonicButton from "@/components/shared/ui/IonicButton";
import AdminHomeLayout from "@/components/admin/layouts/AdminHomeLayout";
import AddButton from "@/components/admin/ui/AddButton";
import { styles } from "@/styles/styles";
import Loader from "@/components/shared/ui/Loader";
import FilterButton from "@/components/shared/ui/FilterButton";
import SortModal from "@/components/shared/modals/SortModal";
import useDepartmentStore from "@/store/useDepartmentStore";
import FilterModal from "@/components/shared/modals/FilterModal";
import NoResultsFound from "@/components/shared/ui/NoResultsFound";
import SearchInput from "@/components/shared/ui/SearchInput";

const sortOptionLabels: Record<string, string> = {
  default: "Default",
  date_asc: "Date (oldest to latest)",
  date_desc: "Date (latest to oldest)",
  name_asc: "Alphabetical (A-Z)",
  name_desc: "Alphabetical (Z-A)",
};

const AdminInstructors = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeInstructorId, setActiveInstructorId] = useState<string | null>(
    null,
  );

  const {
    fetchInstructors,
    deleteInstructor,
    loading,
    sortOption,
    setSortOption,
    getSortedInstructors,
    departmentFilters,
    setDepartmentFilters,
  } = useInstructorStore();
  const filteredInstructors = getSortedInstructors().filter((instructor) =>
    `${instructor.firstName} ${instructor.lastName} ${instructor.employeeId}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );
  const { departments, fetchDepartments } = useDepartmentStore();

  useEffect(() => {
    fetchDepartments?.();
    fetchInstructors?.();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setDepartmentFilters([]);
    setSortOption("default");
    await fetchInstructors?.();
    setRefreshing(false);
  }, [fetchInstructors]);

  return (
    <>
      {loading && (
        <View className="absolute inset-0 z-50 h-screen w-screen opacity-50">
          <Loader />
        </View>
      )}

      <ScrollView
        className="bg-white"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        <AdminHomeLayout>
          <SearchInput value={searchQuery} onChangeText={setSearchQuery} />

          <View className="my-6 flex-row">
            <FilterButton
              onPress={() => setShowFilter(true)}
              label="Departments"
              number={departmentFilters.length}
              active={departmentFilters.length > 0}
            />
            <FilterButton
              onPress={() => setShowSortModal(true)}
              label={`Sort by: ${sortOptionLabels[sortOption] || "Default"}`}
              active={sortOption !== "default"}
            />
          </View>

          {departmentFilters.length > 0 && (
            <View className="mb-6 flex-row flex-wrap items-center gap-x-2 gap-y-3">
              {departmentFilters.length > 0 && [
                ...departmentFilters.map((id) => {
                  const dept = departments.find((d) => d.id === id);
                  if (!dept) return null;
                  return (
                    <View
                      key={id}
                      className="rounded-full border border-border bg-light px-3 py-1"
                    >
                      <Text className="font-inter-medium text-sm text-subtext">
                        {dept.name}
                      </Text>
                    </View>
                  );
                }),
                <TouchableOpacity
                  key="clear-all"
                  onPress={() => setDepartmentFilters([])}
                >
                  <Text className="border-b font-inter-medium text-sm">
                    Clear All
                  </Text>
                </TouchableOpacity>,
              ]}
            </View>
          )}

          {filteredInstructors.length > 0 ? (
            filteredInstructors.map((instructor) => (
              <View key={instructor.id} className="relative mb-6">
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() =>
                    router.push({
                      pathname: "/admin/(tabs)/home/instructor-details",
                      params: { id: instructor.id },
                    })
                  }
                  className="flex-1 flex-row gap-x-4"
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
                    <Text className="font-inter text-subtext">
                      ID: {instructor.employeeId}
                    </Text>
                  </View>
                </TouchableOpacity>

                <IonicButton
                  onPress={() =>
                    setActiveInstructorId(
                      activeInstructorId === instructor.id
                        ? null
                        : instructor.id,
                    )
                  }
                  icon="ellipsis-vertical"
                  size={20}
                  className="absolute right-0 top-0 z-20 mr-[-8px]"
                />

                {activeInstructorId === instructor.id && (
                  <View
                    className="absolute right-2 top-10 z-30 rounded-xl border border-border/30 bg-white"
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
                          { cancelable: true },
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
            ))
          ) : (
            <NoResultsFound />
          )}
        </AdminHomeLayout>

        {activeInstructorId && (
          <TouchableWithoutFeedback onPress={() => setActiveInstructorId(null)}>
            <View className="absolute inset-0 z-10 h-screen w-screen" />
          </TouchableWithoutFeedback>
        )}
      </ScrollView>

      <AddButton
        label="Add Instructor"
        onPress={() => router.push("/admin/(tabs)/home/add-instructor")}
      />

      <FilterModal
        isVisible={showFilter}
        onClose={() => setShowFilter(false)}
        departments={departments}
        departmentFilters={departmentFilters}
        setDepartmentFilters={setDepartmentFilters}
      />

      <SortModal
        isVisible={showSortModal}
        onClose={() => setShowSortModal(false)}
        sortOption={sortOption}
        setSortOption={setSortOption}
      />
    </>
  );
};

export default AdminInstructors;
