import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Picker } from "@react-native-picker/picker";
import { getInstructors } from "@/utils/getInstructors";
import useRoomStore from "@/store/useRoomStore";
import { router } from "expo-router";

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

const AddScheduleForm = ({ roomId }: { roomId: string }) => {
  const [day, setDay] = useState(daysOfWeek[0]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [instructorId, setInstructorId] = useState("");
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(false);
  const { addScheduleToRoom } = useRoomStore();

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
      router.back();
    } catch (error) {
      console.error("Error adding schedule:", error);
      Alert.alert("Error", "Failed to add schedule");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add New Schedule</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Day of Week</Text>
        <Picker
          selectedValue={day}
          onValueChange={(itemValue) => setDay(itemValue)}
          style={styles.picker}
        >
          {daysOfWeek.map((day) => (
            <Picker.Item key={day} label={day} value={day} />
          ))}
        </Picker>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Start Time</Text>
        <TextInput
          style={styles.input}
          placeholder="HH:MM (24-hour format)"
          value={startTime}
          onChangeText={setStartTime}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>End Time</Text>
        <TextInput
          style={styles.input}
          placeholder="HH:MM (24-hour format)"
          value={endTime}
          onChangeText={setEndTime}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Instructor</Text>
        <Picker
          selectedValue={instructorId}
          onValueChange={(itemValue) => setInstructorId(itemValue)}
          style={styles.picker}
        >
          {instructors.map((instructor) => (
            <Picker.Item
              key={instructor.id}
              label={`${instructor.firstName} ${instructor.lastName} (ID: ${instructor.employeeID})`}
              value={instructor.id}
            />
          ))}
        </Picker>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title={loading ? "Adding..." : "Add Schedule"}
          onPress={handleSubmit}
          disabled={loading}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default AddScheduleForm;
