import { View, Text } from "react-native";
import React from "react";
import InstructorLayout from "@/components/instructor/InstructorLayout";
import useUserStore from "@/store/useUserStore";

const Home = () => {
  const { user } = useUserStore();

  return (
    <InstructorLayout>
      <Text>Welcome, {user?.firstName}</Text>
    </InstructorLayout>
  );
};

export default Home;
