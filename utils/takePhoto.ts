import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

export const takePhoto = async (): Promise<string | null> => {
  try {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      return result.assets[0].uri;
    }

    return null;
  } catch (error) {
    console.error("Camera error:", error);
    Alert.alert("Error", "Failed to take photo. Try again later.");
    return null;
  }
};
