import axios from 'axios';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
  Alert,
} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from 'expo-router';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

const LoginScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [error, setError] = useState(null);

  React.useEffect(() => {
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
      Keyboard.dismiss();
  
      if (!phoneNumber || !password) {
        setError('Please enter both phone number and password');
        return;
      }
  
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(phoneNumber)) {
        setError('Please enter a valid 10-digit Indian phone number');
        return;
      }
  
      if (password.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }
      
      const formattedNumber = `+91${phoneNumber}`;
      const pushToken = await registerForPushNotificationsAsync();
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_SERVER_URI}/riders/login`,
        {
          phoneNumber: formattedNumber,
          password,
          notificationToken: pushToken,
        },
        {
          timeout: 10000,
          headers: { 'Content-Type': 'application/json' }
        }
      );
      await AsyncStorage.setItem('accessToken', response.data.data.accessToken);
      router.push('/(tabs)/home');
  
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed. Please try again.');
      Alert.alert('Error', error.response?.data || 'Login failed. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = () => {
    router.replace('(routes)/signup');
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Animated.View style={[styles.innerContainer, { opacity: fadeAnim }]}>
            {/* Header Section */}
            <View style={styles.headerContainer}>
              <Text style={styles.welcomeText}>Welcome Back! 👋</Text>
              <Text style={styles.title}>Login</Text>
              <Text style={styles.subtitle}>
                Enter your registered phone number and password to continue
              </Text>
            </View>

            {/* Phone Number Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <View style={[styles.inputWrapper, isFocused && styles.inputWrapperFocused]}>
                <Text style={styles.countryCode}>+91</Text>
                <TextInput
                  style={styles.input}
                  placeholder="9876543210"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={(text) => {
                    if (/^\d{0,10}$/.test(text)) {
                      setPhoneNumber(text);
                    }
                  }}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  maxLength={10}
                />
              </View>
              <Text style={styles.inputHint}>We'll send you a verification code</Text>
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                  value={password}
                  onChangeText={(text) => setPassword(text)}
                />
              </View>
            </View>

            {/* Button Section */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.loginButton, (phoneNumber.length < 10 || password.length === 0) && styles.loginButtonDisabled]}
                onPress={handleLogin}
                disabled={phoneNumber.length < 10 || password.length === 0}
              >
                <Text style={styles.loginButtonText}>Login</Text>
              </TouchableOpacity>

              <View style={styles.signupPromptContainer}>
                <Text style={styles.signupPromptText}>
                  Don't have an account?{' '}
                  <Text style={styles.signupLink} onPress={handleSignup}>Sign Up</Text>
                </Text>
              </View>

              <View style={styles.termsContainer}>
                <Text style={styles.termsText}>
                  By continuing, you agree to our{' '}
                  <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                  <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>
              </View>
            </View>
          </Animated.View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  headerContainer: {
    marginTop: 40,
  },
  welcomeText: {
    fontSize: 24,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
  inputContainer: {
    marginVertical: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    height: 56,
  },
  inputWrapperFocused: {
    borderColor: '#2563EB',
    borderWidth: 2,
    backgroundColor: '#fff',
  },
  countryCode: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  inputHint: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
  buttonContainer: {
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonDisabled: {
    backgroundColor: '#94A3B8',
    shadowOpacity: 0,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  signupPromptContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  signupPromptText: {
    fontSize: 14,
    color: '#6B7280',
  },
  signupLink: {
    color: '#2563EB',
    fontWeight: '500',
  },
  termsContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  termsText: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  termsLink: {
    color: '#2563EB',
    fontWeight: '500',
  },
});

export default LoginScreen;