import { Link, useRouter } from "expo-router";
import { Text, View, TextInput, TouchableOpacity, Keyboard } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // Import Expo icons
//import auth from "@react-native-firebase/auth";
//import firestore from "@react-native-firebase/firestore";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';

export default function LoginScreen() {
    const router = useRouter();
    const [phoneNo, setPhoneNo] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState(null);
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // New Login Functionality with Phone and Password
    const handleLogin = async () => {
        try {
            setLoading(true);
            Keyboard.dismiss();

            if (!phoneNo || !password) {
                setError("Please enter both phone number and password");
                return;
            }

            const phoneRegex = /^[6-9]\d{9}$/;
            if (!phoneRegex.test(phoneNo)) {
                setError("Please enter a valid 10-digit Indian phone number");
                return;
            }

            if (password.length < 6) {
                setError("Password must be at least 6 characters long");
                return;
            }

            const formattedNumber = `+91${phoneNo}`;
            const response = await axios.post(
                `${process.env.EXPO_PUBLIC_SERVER_URI}/users/login`,
                {
                    phoneNumber: formattedNumber,
                    password,
                },
                {
                    timeout: 10000,
                    headers: { "Content-Type": "application/json" },
                }
            );
            await AsyncStorage.setItem("accessToken", response.data.data.accessToken);
            router.push("/(tabs)/home");
        } catch (error) {
            setError(error.response?.data?.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Commented Out Previous Implementation with OTP
    // const signInWithPhoneNumber = async () => {
    //     try {
    //         const confirmation = await auth().signInWithPhoneNumber(phoneNo);
    //         setConfirm(confirmation);
    //     } catch (e) {
    //         alert("Failed to send OTP. Please check your phone number.");
    //     }
    // };

    // const confirmCode = async () => {
    //     if (confirm) {
    //         try {
    //             const userCredential = await confirm.confirm(code);
    //             const user = userCredential.user;
    //             const userDocument = await firestore().collection("users").doc(user.uid).get();

    //             if (userDocument.exists) {
    //                 router.push("/(tabs)/home");
    //             } else {
    //                 await firestore().collection("users").doc(user.uid).set({
    //                     phoneNo,
    //                     createdAt: new Date().toISOString(),
    //                 });
    //                 router.push("/pages/About");
    //             }
    //         } catch (e) {
    //             alert("Invalid OTP. Please try again.");
    //         }
    //     } else {
    //         alert("Please request an OTP before confirming.");
    //     }
    // };

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 20, backgroundColor: "#f0f8f5" }}>
            <Text style={{ fontSize: 28, fontWeight: "600", marginBottom: 30, color: "#2c6d6a" }}>Welcome Back!</Text>

            <View style={{ width: "100%", alignItems: "center", marginBottom: 20 }}>
                <TextInput
                    style={{
                        height: 50,
                        borderColor: "#e6e6e6",
                        borderWidth: 1,
                        width: "100%",
                        paddingHorizontal: 15,
                        borderRadius: 10,
                        backgroundColor: "#fff",
                        marginBottom: 15,
                    }}
                    placeholder="Phone Number"
                    keyboardType="phone-pad"
                    onChangeText={setPhoneNo}
                    value={phoneNo}
                />
                <TextInput
                    style={{
                        height: 50,
                        borderColor: "#e6e6e6",
                        borderWidth: 1,
                        width: "100%",
                        paddingHorizontal: 15,
                        borderRadius: 10,
                        backgroundColor: "#fff",
                        marginBottom: 15,
                    }}
                    placeholder="Password"
                    secureTextEntry
                    onChangeText={setPassword}
                    value={password}
                />

                <TouchableOpacity
                    onPress={handleLogin}
                    style={{
                        backgroundColor: "#6bd6b4",
                        paddingVertical: 12,
                        borderRadius: 10,
                        width: "100%",
                        alignItems: "center",
                        marginBottom: 20,
                    }}
                >
                    <Text style={{ color: "#fff", fontSize: 16 }}>Login</Text>
                </TouchableOpacity>
            </View>

            <Text style={{ fontSize: 16, color: "#888", marginBottom: 15 }}>or login with</Text>

            <View style={{ flexDirection: "row", width: "100%", justifyContent: "center" }}>
                <TouchableOpacity style={{ backgroundColor: "#e0e0e0", padding: 12, borderRadius: 10 }}>
                    <MaterialCommunityIcons name="google" size={24} color="#DB4437" />
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => router.push("/signup")} style={{ marginTop: 25 }}>
                <Text style={{ color: "#2c6d6a", fontSize: 14 }}>Don't have an account? Sign up</Text>
            </TouchableOpacity>
        </View>
    );
}
