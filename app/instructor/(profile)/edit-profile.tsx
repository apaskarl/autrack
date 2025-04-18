import {
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Text,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import useUserStore from "@/store/useUserStore";
import { router, useNavigation } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";
import FormInput from "@/components/instructor/FormInput";

const EditProfile = () => {
  const { user, setUser } = useUserStore();
  const navigation = useNavigation();

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [image, setImage] = useState(user?.photoURL || null);
  const [newImageUrl, setNewImageUrl] = useState<string | null>(null); // Store the new URL temporarily

  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(false);
  const hasChanges =
    firstName !== user?.firstName ||
    lastName !== user?.lastName ||
    (image !== user?.photoURL && image !== null);

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
        setImage(uri); // Set the local image URI for preview

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
          // Store the new URL but don't update Firestore yet
          setNewImageUrl(data.secure_url);
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
    setEditing(true);

    try {
      if (user?.uid) {
        const updateData: {
          firstName: string;
          lastName: string;
          photoURL?: string;
        } = {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
        };

        // Only include photoURL in the update if we have a new image URL
        if (newImageUrl) {
          updateData.photoURL = newImageUrl;
        }

        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, updateData);

        setUser({
          ...user,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          photoURL: newImageUrl || user.photoURL,
        });

        router.back();
      }
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setEditing(false);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={handleSave}
          disabled={!hasChanges || uploading || editing}
          className={`${
            !hasChanges || uploading || editing ? "opacity-40" : "opacity-100"
          }`}
        >
          <Text className="mr-5 font-inter-semibold">
            {editing ? <ActivityIndicator color="black" /> : "Save"}
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, handleSave, hasChanges, uploading, editing]);

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

      <View className="gap-y-5">
        <FormInput
          label="First Name"
          value={firstName}
          onChangeText={setFirstName}
        />

        <FormInput
          label="Last Name"
          value={lastName}
          onChangeText={setLastName}
        />
      </View>
    </View>
  );
};

export default EditProfile;
