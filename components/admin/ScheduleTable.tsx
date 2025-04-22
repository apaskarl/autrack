import { View, Text } from "react-native";
import React from "react";

// Helper to create a consistent time slot array
const generateTimeSlots = (start = 7, end = 18) => {
  const slots = [];
  for (let i = start; i < end; i++) {
    slots.push(`${i}:00 - ${i + 1}:00`);
  }
  return slots;
};

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const ScheduleTable = ({ schedules }: { schedules: any[] }) => {
  const timeSlots = generateTimeSlots();

  const getSchedule = (day: string, timeSlot: string) => {
    const [startHour] = timeSlot.split(":");
    return schedules.find(
      (s) => s.day === day && s.start_time.startsWith(startHour)
    );
  };

  return (
    <View className="border border-gray-300">
      {/* Header Row */}
      <View className="flex-row">
        <View className="w-24 border-r border-b border-gray-300 bg-gray-100 p-2">
          <Text className="font-bold">Time</Text>
        </View>
        {days.map((day) => (
          <View
            key={day}
            className="flex-1 border-r border-b border-gray-300 bg-gray-100 p-2"
          >
            <Text className="font-bold text-center">{day}</Text>
          </View>
        ))}
      </View>

      {/* Time Rows */}
      {timeSlots.map((slot) => (
        <View key={slot} className="flex-row">
          {/* Time Label */}
          <View className="w-24 border-r border-b border-gray-300 p-2">
            <Text className="text-xs">{slot}</Text>
          </View>

          {/* Daily Columns */}
          {days.map((day) => {
            const sched = getSchedule(day, slot);
            return (
              <View
                key={day + slot}
                className="flex-1 border-r border-b border-gray-300 p-2"
              >
                {sched ? (
                  <>
                    <Text className="text-xs font-semibold">
                      {sched.instructor_name}
                    </Text>
                    <Text className="text-xs">
                      {sched.start_time} - {sched.end_time}
                    </Text>
                  </>
                ) : null}
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
};

export default ScheduleTable;
