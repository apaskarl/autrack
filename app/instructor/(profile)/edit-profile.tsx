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
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";
import FormInput from "@/components/instructor/FormInput";
import { SafeAreaView } from "react-native-safe-area-context";
import Modal from "react-native-modal";

const EditProfile = () => {
  const { user, setUser } = useUserStore();
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [image, setImage] = useState(user?.photoURL || null);
  const [showModal, setShowModal] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [editing, setEditing] = useState(false);
  const hasChanges =
    firstName !== user?.firstName ||
    lastName !== user?.lastName ||
    (image !== user?.photoURL && image !== null);

  const choosePhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setImage(uri);
      }
    } catch (error) {
      console.error("Image selection error:", error);
      Alert.alert("Error", "Failed to select image. Try again later.");
    } finally {
      setShowModal(false);
    }
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setImage(uri);
      }
    } catch (error) {
      console.error("Camera error:", error);
      Alert.alert("Error", "Failed to take photo. Try again later.");
    } finally {
      setShowModal(false);
    }
  };

  const handleSave = async () => {
    setEditing(true);

    try {
      let uploadedImageUrl = null;

      if (image && image !== user?.photoURL) {
        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/dsbbcevcp/upload`;

        const formData = new FormData();
        formData.append("file", {
          uri: image,
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
          uploadedImageUrl = data.secure_url;
        }
      }

      if (user?.uid) {
        const updateData: {
          firstName: string;
          lastName: string;
          photoURL?: string;
        } = {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
        };

        if (uploadedImageUrl) {
          updateData.photoURL = uploadedImageUrl;
        }

        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, updateData);

        setUser({
          ...user,
          firstName: updateData.firstName,
          lastName: updateData.lastName,
          photoURL: uploadedImageUrl || user.photoURL,
        });

        router.back();
      }
    } catch (error) {
      console.error("Update error:", error);
      Alert.alert("Error", "Failed to update profile. Try again later.");
    } finally {
      setEditing(false);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={handleSave}
          disabled={!hasChanges || previewing || editing}
          className={`${
            !hasChanges || previewing || editing ? "opacity-40" : "opacity-100"
          }`}
        >
          <Text className="mr-5 font-inter-semibold">
            {editing ? <ActivityIndicator color="black" /> : "Save"}
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, handleSave, hasChanges, previewing, editing]);

  return (
    <>
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 p-8">
          <View className="items-center mb-8">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setShowModal(true)}
              disabled={previewing}
            >
              {previewing ? (
                <View className="size-28 rounded-full bg-light items-center justify-center">
                  <ActivityIndicator size="small" color="#000" />
                </View>
              ) : (
                <View className="relative items-center">
                  <Image
                    source={{
                      uri: image || "https://via.placeholder.com/150",
                    }}
                    className="size-28 rounded-full  bg-black"
                  />
                  <MaterialCommunityIcons
                    name="pencil-outline"
                    size={20}
                    color={COLORS.white}
                    className="absolute bottom-[-5px] right-[-5px] border-2 border-white bg-primary p-2 rounded-full"
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
      </SafeAreaView>

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
        style={{ margin: 0, padding: 0 }}
      >
        <View className="flex-1 bg-black/50 px-8 justify-center items-center ">
          <View className="bg-white rounded-3xl p-6 w-full">
            <Text className="text-lg font-inter-bold mb-4">
              Change profile photo
            </Text>

            <View>
              <TouchableOpacity
                onPress={choosePhoto}
                activeOpacity={0.5}
                className="py-4"
              >
                <Text className="font-inter-medium text-black">
                  Choose photo
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={takePhoto}
                activeOpacity={0.5}
                className="py-4"
              >
                <Text className="font-inter-medium text-black">Take photo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                  setImage(
                    "https://res.cloudinary.com/dsbbcevcp/image/upload/v1744735512/user_itndrd.jpg"
                  );
                  setShowModal(false);
                }}
                className="py-4"
              >
                <Text className="font-inter-medium text-black">
                  Remove current photo
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default EditProfile;
