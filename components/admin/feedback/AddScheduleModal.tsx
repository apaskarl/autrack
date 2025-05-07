import { View, Text, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import Modal from "react-native-modal";
import { SafeAreaView } from "react-native-safe-area-context";
import useScheduleStore from "@/store/useScheduleStore";
import { useInstructorStore } from "@/store/useInstructorStore";
import PickerField from "@/components/shared/ui/PickerField";
import FormButton from "@/components/shared/ui/FormButton";
import IonicButton from "@/components/shared/ui/IonicButton";

const daysOfWeek = [
  // { label: "Sunday", value: 0 },
  { label: "Monday", value: 1 },
  { label: "Tuesday", value: 2 },
  { label: "Wednesday", value: 3 },
  { label: "Thursday", value: 4 },
  { label: "Friday", value: 5 },
  { label: "Saturday", value: 6 },
];

type AddScheduleFormProps = {
  roomId: string;
  showModal: boolean;
  setShowModal: (value: boolean) => void;
};

const AddScheduleModal = ({
  roomId,
  showModal,
  setShowModal,
}: AddScheduleFormProps) => {
  const { addScheduleToRoom } = useScheduleStore();
  const { instructors, fetchInstructors } = useInstructorStore();

  const [day, setDay] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const [instructorId, setInstructorId] = useState<string | null>(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const getFilteredEndTimes = () => {
    const allTimes = generateTimeOptions();
    if (!startTime) return allTimes;
    const startMinutes = timeToMinutes(startTime);
    return allTimes.filter((time) => timeToMinutes(time) > startMinutes);
  };

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 7; hour <= 21; hour++) {
      for (let min = 0; min < 60; min += 30) {
        if (hour === 22 && min > 0) continue; // Skip 21:30
        const formatted = `${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
        times.push(formatted);
      }
    }
    return times;
  };

  useEffect(() => {
    setEndTime(null);
  }, [startTime]);

  const handleSubmit = async () => {
    if (!startTime || !endTime || day === null || !instructorId) {
      setError("Please fill out all the fields.");
      return;
    }

    const selectedInstructor = instructors.find((i) => i.id === instructorId);
    if (!selectedInstructor) {
      Alert.alert("Error", "Please select a valid instructor");
      return;
    }

    try {
      setLoading(true);
      await addScheduleToRoom(roomId, {
        day,
        startTime,
        endTime,
        instructorId,
      });

      Alert.alert("Success", "Schedule added successfully");
      setShowModal(false);
    } catch (error) {
      console.error("Error adding schedule:", error);
      Alert.alert("Error", "Failed to add schedule");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isVisible={showModal}
      onBackButtonPress={() => setShowModal(false)}
      onBackdropPress={() => setShowModal(false)}
      animationIn="fadeIn"
      animationOut="fadeOut"
      backdropOpacity={0}
      statusBarTranslucent
      style={{ margin: 0 }}
    >
      <SafeAreaView className="flex-1 items-center justify-center bg-black/50 px-5">
        <View className="w-full rounded-2xl bg-white p-5">
          <Text className="mb-6 font-inter-bold text-lg">Add New Schedule</Text>
          <IonicButton
            onPress={() => setShowModal(false)}
            icon="close"
            size={24}
            className="absolute right-5 top-3"
          />

          <View className="gap-y-6">
            {error && (
              <View className="rounded-xl bg-red/10 px-5 py-3">
                <Text className="font-inter-medium text-sm text-red">
                  {error}
                </Text>
              </View>
            )}

            <PickerField
              title="Instructor"
              selectedValue={instructorId}
              onValueChange={(itemValue) => setInstructorId(itemValue)}
              options={instructors.map((instructor) => ({
                label: `${instructor.firstName} ${instructor.lastName}`,
                value: instructor.id,
              }))}
              error={!instructorId && !!error}
            />

            <PickerField
              title="Day"
              selectedValue={day}
              onValueChange={(itemValue) => setDay(itemValue)}
              options={daysOfWeek}
              error={day === null && !!error}
            />

            <View className="flex-row items-center gap-x-6">
              <View className="flex-1">
                <PickerField
                  title="Start Time"
                  selectedValue={startTime}
                  onValueChange={(itemValue) => setStartTime(itemValue)}
                  options={[
                    { label: "Select start time", value: null },
                    ...generateTimeOptions().map((time) => ({
                      label: time,
                      value: time,
                    })),
                  ]}
                  error={!startTime && !!error}
                />
              </View>

              <View className="flex-1">
                <PickerField
                  title="End Time"
                  selectedValue={endTime}
                  onValueChange={(itemValue) => setEndTime(itemValue)}
                  options={[
                    { label: "Select end time", value: null },
                    ...getFilteredEndTimes().map((time) => ({
                      label: time,
                      value: time,
                    })),
                  ]}
                  error={!endTime && !!error}
                />
              </View>
            </View>

            <FormButton
              label="Add Schedule"
              onPress={handleSubmit}
              loading={loading}
            />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default AddScheduleModal;
