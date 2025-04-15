import {
  View,
  Text,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import AuthInput from "@/components/auth/AuthInput";
import AuthButton from "@/components/auth/AuthButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import useUserStore from "@/store/useUserStore";
import { doc, getDoc } from "firebase/firestore";

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { setUser } = useUserStore();

  const handleLogin = async () => {
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Fetch user data from Firestore
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        setUser({
          uid: user.uid,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
        });

        router.replace("/instructor/home");
      } else {
        Alert.alert("Login Failed", "User data not found in Firestore.");
      }
    } catch (error: any) {
      Alert.alert("Login Failed", error.message);
    }

    setLoading(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-8">
      <KeyboardAvoidingView className="flex-1">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View className="py-24 gap-y-16 justify-center w-full">
            <View className="items-center gap-y-4">
              <Image
                source={require("../../assets/images/logos/logo-outline-primary.png")}
                className="size-16"
                resizeMode="contain"
              />
              <Text className="font-inter-bold leading-relaxed text-4xl px-5 text-center">
                Log in to your account
              </Text>
              <Text className="font-inter text-subtext">
                Enter your email and password to log in
              </Text>
            </View>

            <View className="gap-y-5">
              <AuthInput
                label="Email"
                email
                value={email}
                onChangeText={setEmail}
              />

              <AuthInput
                label="Password"
                password
                value={password}
                onChangeText={setPassword}
              />

              <View className="items-end">
                <TouchableOpacity
                  onPress={() => router.push("/auth/reset/forgot-password")}
                  activeOpacity={0.8}
                >
                  <Text className="font-inter-semibold text-primary underline">
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </View>

              <AuthButton
                label={loading ? "Logging in..." : "Log In"}
                onPress={handleLogin}
                disabled={loading}
              />
            </View>

            <View className="flex-row items-center gap-x-1 justify-center">
              <Text className="font-inter text-subtext">No account?</Text>
              <TouchableOpacity
                onPress={() => router.push("/auth/register/register")}
                activeOpacity={0.8}
              >
                <Text className="font-inter-semibold text-primary underline">
                  Register here
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LogIn;
