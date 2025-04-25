import { View, Text, Alert, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { Picker } from "@react-native-picker/picker";
import { getInstructors } from "@/utils/getInstructors";
import useRoomStore from "@/store/useRoomStore";
import { router } from "expo-router";
import Modal from "react-native-modal";
import { SafeAreaView } from "react-native-safe-area-context";
import InputContainer from "./InputContainer";

const daysOfWeek = [
  { label: "Sunday", value: 0 },
  { label: "Monday", value: 1 },
  { label: "Tuesday", value: 2 },
  { label: "Wednesday", value: 3 },
  { label: "Thursday", value: 4 },
  { label: "Friday", value: 5 },
  { label: "Saturday", value: 6 },
];

type Instructor = {
  id: string;
  firstName: string;
  lastName: string;
  employeeId: number;
};

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
  const { addScheduleToRoom } = useRoomStore();

  const [day, setDay] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const [instructorId, setInstructorId] = useState<string | null>(null);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
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
        if (hour === 21 && min > 0) continue; // Skip 21:30
        const formatted = `${String(hour).padStart(2, "0")}:${String(
          min
        ).padStart(2, "0")}`;
        times.push(formatted);
      }
    }
    return times;
  };

  useEffect(() => {
    setEndTime(null); // Reset endTime if startTime changes
  }, [startTime]);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const data = await getInstructors();
        const instructorsData = data.map((doc) => ({
          id: doc.id,
          firstName: doc.firstName,
          lastName: doc.lastName,
          employeeId: doc.employeeId,
        }));
        setInstructors(instructorsData);
      } catch (error) {
        console.error("Error fetching instructors:", error);
        Alert.alert("Error", "Failed to load instructors");
      }
    };

    fetchInstructors();
  }, []);

  const handleSubmit = async () => {
    if (!startTime || !endTime || !day || !instructorId) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const selectedInstructor = instructors.find((i) => i.id === instructorId);
    if (!selectedInstructor) {
      Alert.alert("Error", "Please select an instructor");
      return;
    }

    try {
      setLoading(true);
      await addScheduleToRoom(roomId, {
        day,
        startTime: startTime,
        endTime: endTime,
        instructorId: instructorId,
        instructorName: `${selectedInstructor.firstName} ${selectedInstructor.lastName}`,
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
      <SafeAreaView className="flex-1 bg-black/50 px-8 justify-center items-center">
        <View className="bg-white p-8 w-full rounded-lg">
          <Text className="font-inter-bold text-lg">Add New Schedule</Text>

          <View className="py-8 gap-y-5">
            <InputContainer title="Instructor">
              <View className="border border-border rounded-lg">
                <Picker
                  selectedValue={instructorId}
                  onValueChange={(itemValue) => setInstructorId(itemValue)}
                >
                  <Picker.Item label="Select instructor" value={null} />
                  {instructors.map((instructor) => (
                    <Picker.Item
                      key={instructor.id}
                      label={`${instructor.firstName} ${instructor.lastName}`}
                      value={instructor.id}
                    />
                  ))}
                </Picker>
              </View>
            </InputContainer>

            <InputContainer title="Day">
              <View className="border border-border rounded-lg">
                <Picker
                  selectedValue={day}
                  onValueChange={(itemValue) => setDay(itemValue)}
                >
                  <Picker.Item label="Select day" value={null} />
                  {daysOfWeek.map(({ label, value }) => (
                    <Picker.Item key={value} label={label} value={value} />
                  ))}
                </Picker>
              </View>
            </InputContainer>

            <View className="flex-row gap-x-4 items-center">
              <View className="flex-1">
                <InputContainer title="Start Time">
                  <View className="border border-border rounded-lg">
                    <Picker
                      selectedValue={startTime}
                      onValueChange={(itemValue) => setStartTime(itemValue)}
                    >
                      <Picker.Item label="Select start time" value={null} />
                      {generateTimeOptions().map((time) => (
                        <Picker.Item key={time} label={time} value={time} />
                      ))}
                    </Picker>
                  </View>
                </InputContainer>
              </View>

              <Text className="font-inter-semibold text-2xl mt-6">-</Text>

              <View className="flex-1">
                <InputContainer title="End Time">
                  <View className="border border-border rounded-lg">
                    <Picker
                      selectedValue={endTime}
                      onValueChange={(itemValue) => setEndTime(itemValue)}
                    >
                      <Picker.Item
                        label={
                          startTime
                            ? "Select end time"
                            : "Select start time first"
                        }
                        value={null}
                      />
                      {getFilteredEndTimes().map((time) => (
                        <Picker.Item key={time} label={time} value={time} />
                      ))}
                    </Picker>
                  </View>
                </InputContainer>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-blue rounded-lg px-6 items-center py-4"
            disabled={loading}
          >
            <Text className="font-inter-bold text-white">
              {loading ? "Adding..." : "Add Schedule"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default AddScheduleModal;
