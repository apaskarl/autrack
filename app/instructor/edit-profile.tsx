import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState } from "react";
import useUserStore from "@/store/useUserStore";
import InstructorLayout from "@/components/instructor/InstructorLayout";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";

const EditProfile = () => {
  const { user, setUser } = useUserStore();
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [image, setImage] = useState(user?.photoURL || null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setUploading(true);
        const uri = result.assets[0].uri;
        setImage(uri);

        // Upload to Cloudinary
        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/dsbbcevcp/upload`;

        const formData = new FormData();
        formData.append("file", {
          uri,
          type: "image/jpeg",
          name: `profile_${user?.uid}.jpg`,
        } as any);
        formData.append("upload_preset", "autrack");
        formData.append("cloud_name", "dsbbcevcp");

        const response = await fetch(cloudinaryUrl, {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const data = await response.json();

        if (data.secure_url) {
          // Update Firestore with new photoURL
          if (user?.uid) {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
              photoURL: data.secure_url,
            });

            // Update local state
            setUser({
              ...user,
              photoURL: data.secure_url,
              firstName,
              lastName,
            });
          }
        }
      }
    } catch (error) {
      console.error("Image upload error:", error);
      Alert.alert("Error", "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (user?.uid) {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          firstName,
          lastName,
        });

        setUser({
          ...user,
          firstName,
          lastName,
          photoURL: image || user.photoURL,
        });

        Alert.alert("Success", "Profile updated successfully");
        router.back();
      }
    } catch (error) {
      console.error("Update error:", error);
      Alert.alert("Error", "Failed to update profile");
    }
  };

  return (
    <View className="flex-1 bg-white p-8">
      <View className="items-center mb-8">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={pickImage}
          disabled={uploading}
        >
          {uploading ? (
            <View className="size-28 rounded-full bg-light items-center justify-center">
              <ActivityIndicator size="small" color="#000" />
            </View>
          ) : (
            <View className="relative">
              <Image
                source={{ uri: image || "https://via.placeholder.com/150" }}
                className="size-28 rounded-full opacity-60 bg-black"
              />
              <Ionicons
                name="camera-outline"
                size={30}
                color={COLORS.white}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              />
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View className="mb-4">
        <Text className="font-inter-medium mb-1">First Name</Text>
        <TextInput
          value={firstName}
          onChangeText={setFirstName}
          className="border border-gray-300 rounded-lg p-3 font-inter"
          placeholder="Enter first name"
        />
      </View>

      <View className="mb-6">
        <Text className="font-inter-medium mb-1">Last Name</Text>
        <TextInput
          value={lastName}
          onChangeText={setLastName}
          className="border border-gray-300 rounded-lg p-3 font-inter"
          placeholder="Enter last name"
        />
      </View>

      <TouchableOpacity
        onPress={handleSave}
        className="bg-primary py-3 rounded-lg items-center"
        disabled={uploading}
      >
        {uploading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-inter-bold">Save Changes</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default EditProfile;
