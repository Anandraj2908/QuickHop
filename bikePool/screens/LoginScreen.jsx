import { useRouter } from "expo-router";
import { 
    Text, 
    View, 
    TextInput, 
    TouchableOpacity, 
    Modal,
    StyleSheet,
    Animated,
    Dimensions,
    ActivityIndicator,
    Platform,
    KeyboardAvoidingView,
    SafeAreaView
} from "react-native";
import { useEffect, useState, useCallback } from "react";
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Toast from "../components/Toast";

export default function LoginScreen() {
    const router = useRouter();
    const [phoneNo, setPhoneNo] = useState("");
    const [pin, setPin] = useState("");
    const [showPinModal, setShowPinModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fadeAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();

        checkExistingToken();
    }, []);

    const checkExistingToken = async () => {
        try {
            const token = await AsyncStorage.getItem("accessToken");
            if (token) {
                router.replace("/(tabs)/home");
            }
        } catch (error) {
            console.error("Token check failed:", error);
        }
    };

    const handlePhoneSubmit = async () => {
        setError(null);
        const phoneRegex = /^[6-9]\d{9}$/;
        
        if (!phoneRegex.test(phoneNo)) {
            setError("Please enter a valid 10-digit Indian phone number");
            Toast.show("Invalid phone number format", { type: "error" });
            return;
        }

        setShowPinModal(true);
    };

    const handleKeyPress = useCallback((key) => {
        if (pin.length < 6) {
            setPin(prev => prev + key);
        }
    }, [pin]);
    
    const handleDelete = useCallback(() => {
        setPin(prev => prev.slice(0, -1));
    }, []);

    useEffect(() => {
        if (pin.length === 6) {
            handleLogin();
        }
    }, [pin]);

    async function registerForPushNotificationsAsync() {
        let token = null;
        
        if (!Device.isDevice) {
            Toast.show("Push notifications require a physical device", { type: "warning" });
            return null;
        }

        try {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            
            if (existingStatus !== "granted") {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            
            if (finalStatus !== "granted") {
                Toast.show("Push notifications permission not granted", { type: "warning" });
                return null;
            }

            const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
            if (!projectId) {
                throw new Error("Project ID not found");
            }

            token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
            
            if (Platform.OS === "android") {
                await Notifications.setNotificationChannelAsync("default", {
                    name: "default",
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: "#FF231F7C",
                });
            }
        } catch (error) {
            console.error("Push notification setup failed:", error);
            Toast.show("Failed to setup push notifications", { type: "error" });
        }

        return token;
    }

    const handleLogin = async () => {
        try {
            setLoading(true);
            setError(null);

            if (!phoneNo || !pin) {
                throw new Error("Please enter both phone number and PIN");
            }

            if (pin.length !== 6) {
                throw new Error("PIN must be exactly 6 digits");
            }

            const formattedNumber = `+91${phoneNo}`;
            const pushToken = await registerForPushNotificationsAsync();
            
            const response = await axios.post(
                `${process.env.EXPO_PUBLIC_SERVER_URI}/users/login`,
                {
                    phoneNumber: formattedNumber,
                    password: pin,
                    notificationToken: pushToken,
                },
                {
                    timeout: 10000,
                    headers: { "Content-Type": "application/json" },
                }
            );

            await AsyncStorage.setItem("accessToken", response.data.data.accessToken);
            router.replace("/(tabs)/home");
        } catch (error) {
            setError("Login failed. Please try again.");
            setPin("");  
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = () =>{
        router.replace("/(routes)/signup")
    }

    const CustomKeypad = useCallback(() => (
        <View style={styles.keypadContainer}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
                <TouchableOpacity
                    key={num}
                    style={styles.keypadButton}
                    onPress={() => handleKeyPress(num.toString())}
                    disabled={loading}
                >
                    <Text style={styles.keypadText}>{num}</Text>
                </TouchableOpacity>
            ))}
            <TouchableOpacity
                style={styles.keypadButton}
                onPress={handleDelete}
                disabled={loading}
            >
                <Ionicons name="backspace-outline" size={24} color="#fff" />
            </TouchableOpacity>
        </View>
    ), [handleKeyPress, handleDelete, loading]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <Toast/>
            <LinearGradient
                colors={['#000000', '#1a1a1a']}
                style={styles.container}
            >
                <KeyboardAvoidingView 
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.keyboardAvoidingView}
                >
                    <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                        <View style={styles.bikeIconContainer}>
                            <MaterialCommunityIcons name="motorbike" size={40} color="#4a6fff" />
                        </View>
                        
                        <Text style={styles.title}>LOGIN TO YOUR ACCOUNT</Text>

                        <View style={styles.inputContainer}>
                            <View style={styles.inputWrapper}>
                                <Text style={styles.phonePrefix}>+91</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Phone Number"
                                    placeholderTextColor="#6c6c7e"
                                    keyboardType="phone-pad"
                                    value={phoneNo}
                                    onChangeText={setPhoneNo}
                                    maxLength={10}
                                    editable={!loading}
                                />
                            </View>

                            

                            <TouchableOpacity 
                                style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                                onPress={handlePhoneSubmit}
                                disabled={loading || phoneNo.length !== 10}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#FFFFFF" />
                                ) : (
                                    <Text style={styles.loginButtonText}>CONTINUE</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                        <View style={styles.signupContainer}>
                            <Text style={styles.signupText}>
                                New here?{' '}
                                <Text 
                                    style={styles.signupLink} 
                                    onPress={handleSignUp} 
                                > 
                                    Sign Up
                                </Text>
                            </Text>
                        </View>
                        <Modal
                            visible={showPinModal}
                            animationType="slide"
                            transparent={true}
                            onRequestClose={() => {
                                if (!loading) {
                                    setShowPinModal(false);
                                    setPin("");
                                }
                            }}
                        >
                            <View style={styles.modalContainer}>
                                <View style={styles.modalContent}>
                                    <TouchableOpacity 
                                        style={styles.closeButton}
                                        onPress={() => {
                                            if (!loading) {
                                                setShowPinModal(false);
                                                setPin("");
                                            }
                                        }}
                                    >
                                        <Ionicons name="close" size={24} color="#fff" />
                                    </TouchableOpacity>

                                    <Text style={styles.modalTitle}>Enter 6-digit PIN</Text>
                                    <Text style={styles.modalSubtitle}>Please enter your PIN to login</Text>
                                    {error && <Text style={styles.errorText}>{error}</Text>}
                                    <View style={styles.pinContainer}>
                                        {Array.from({ length: 6 }).map((_, index) => (
                                            <View
                                                key={index}
                                                style={[
                                                    styles.pinDot,
                                                    pin.length > index && styles.pinDotFilled
                                                ]}
                                            />
                                        ))}
                                    </View>

                                    {loading && (
                                        <View style={styles.loadingOverlay}>
                                            <ActivityIndicator size="large" color="#4a6fff" />
                                        </View>
                                    )}

                                    <CustomKeypad />
                                </View>
                            </View>
                        </Modal>
                    </Animated.View>
                </KeyboardAvoidingView>
            </LinearGradient>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#000000', 
    },
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)', 
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    bikeIconContainer: {
        alignItems: 'center',
        marginTop: Platform.OS === 'ios' ? 20 : 40,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#E0E0E0',
        textAlign: 'center',
        marginBottom: 30,
    },
    inputContainer: {
        width: '100%',
        alignItems: 'center',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: 55,
        backgroundColor: 'rgba(255, 255, 255, 0.05)', 
        borderRadius: 15,
        marginBottom: 15,
        paddingHorizontal: 15,
    },
    phonePrefix: {
        color: '#BBBBBB', 
        fontSize: 16,
        marginRight: 10,
    },
    input: {
        flex: 1,
        color: '#FFFFFF', 
        fontSize: 16,
        padding: 0,
    },
    errorText: {
        color: 'rgba(255, 70, 70, 0.8)',
        fontSize: 14,
        marginBottom: 15,
        textAlign: 'center',
    },
    loginButton: {
        width: '100%',
        height: 55,
        backgroundColor: 'rgba(74, 111, 255, 0.6)', 
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginButtonDisabled: {
        backgroundColor: 'rgba(74, 111, 255, 0.3)', 
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)', 
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'rgba(31, 31, 31, 0.8)', 
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 20,
        paddingTop: 30,
        minHeight: Dimensions.get('window').height * 0.6,
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 1,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#E0E0E0',
        textAlign: 'center',
    },
    modalSubtitle: {
        fontSize: 14,
        color: '#BBBBBB',
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 30,
    },
    pinContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 30,
    },
    pinDot: {
        width: 13,
        height: 13,
        borderRadius: 7,
        backgroundColor: 'rgba(255, 255, 255, 0.1)', 
        marginHorizontal: 8,
    },
    pinDotFilled: {
        backgroundColor: 'rgba(74, 111, 255, 0.6)',
    },
    keypadContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    keypadButton: {
        width: '30%',
        height: 75,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.4)', 
        borderRadius: 10,
    },
    keypadText: {
        color: '#FFFFFF',
        fontSize: 28,
        fontWeight: '600',
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(18, 18, 18, 0.8)', 
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
    },
    signupContainer: {
        marginTop: 15,
        alignItems: 'center',
    },
    signupText: {
        color: '#BBBBBB', 
        fontSize: 14,
    },
    signupLink: {
        color: '#4a6fff', 
        fontWeight: '700', 
        textDecorationLine: 'underline', 
    },
    
    
});
