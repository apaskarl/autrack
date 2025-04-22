import { View, Text, TextInput, Alert, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { Picker } from "@react-native-picker/picker";
import { getInstructors } from "@/utils/getInstructors";
import useRoomStore from "@/store/useRoomStore";
import { router } from "expo-router";
import Modal from "react-native-modal";
import { SafeAreaView } from "react-native-safe-area-context";
import InputContainer from "./InputContainer";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

type Instructor = {
  id: string;
  firstName: string;
  lastName: string;
  employeeID: number;
};

type AddScheduleFormProps = {
  roomId: string;
  showModal: boolean;
  setShowModal: (value: boolean) => void;
};

const AddScheduleForm = ({
  roomId,
  showModal,
  setShowModal,
}: AddScheduleFormProps) => {
  const { addScheduleToRoom } = useRoomStore();

  const [day, setDay] = useState(daysOfWeek[0]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [instructorId, setInstructorId] = useState("");
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const data = await getInstructors();
        const instructorsData = data.map((doc) => ({
          id: doc.id,
          firstName: doc.firstName,
          lastName: doc.lastName,
          employeeID: doc.employeeID,
        }));
        setInstructors(instructorsData);
        if (instructorsData.length > 0) {
          setInstructorId(instructorsData[0].id);
        }
      } catch (error) {
        console.error("Error fetching instructors:", error);
        Alert.alert("Error", "Failed to load instructors");
      }
    };

    fetchInstructors();
  }, []);

  const handleSubmit = async () => {
    if (!startTime || !endTime) {
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
        start_time: startTime,
        end_time: endTime,
        instructor_id: instructorId,
        instructor_name: `${selectedInstructor.firstName} ${selectedInstructor.lastName}`,
      });
      Alert.alert("Success", "Schedule added successfully");
      setShowModal(false);
      router.back();
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
      backdropTransitionOutTiming={0}
      backdropTransitionInTiming={0}
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
                  {daysOfWeek.map((day) => (
                    <Picker.Item key={day} label={day} value={day} />
                  ))}
                </Picker>
              </View>
            </InputContainer>

            <InputContainer title="Start Time">
              <TextInput
                placeholder="HH:MM (24-hour format)"
                value={startTime}
                onChangeText={setStartTime}
                className="border border-border rounded-lg px-4 py-5"
              />
            </InputContainer>
            <InputContainer title="End Time">
              <TextInput
                placeholder="HH:MM (24-hour format)"
                value={endTime}
                onChangeText={setEndTime}
                className="border border-border rounded-lg px-4 py-5"
              />
            </InputContainer>
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

export default AddScheduleForm;
