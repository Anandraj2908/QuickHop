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
} from 'react-native';
import { Redirect, useNavigation } from "expo-router";

const SignupScreen = () => {

    const navigation = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isFocused, setIsFocused] = useState({
    phone: false,
  });
  const [fadeAnim] = useState(new Animated.Value(0));

  // Fade in animation on component mount
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSignup = () => {
    if (phoneNumber.length === 10 && name.trim()) {
      const formattedNumber = `+91${phoneNumber}`; // Format the phone number for backend
      const userData = {
        phone: formattedNumber,
      };
      // You can add your signup logic here using userData
      console.log("Sending signup request with:", userData);
    } else {
      console.log("Please fill all fields correctly");
    }
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Animated.View 
            style={[
              styles.innerContainer,
              { opacity: fadeAnim }
            ]}
          >
            {/* Header Section */}
            <View style={styles.headerContainer}>
              <Text style={styles.welcomeText}>Welcome! 👋</Text>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>
                Fill in your details to get started
              </Text>
            </View>

            {/* Input Section */}
            <View style={styles.inputContainer}>
              

              {/* Phone Input */}
              <Text style={[styles.inputLabel, { marginTop: 16 }]}>Phone Number</Text>
              <View style={[
                styles.inputWrapper, 
                isFocused.phone && styles.inputWrapperFocused
              ]}>
                <Text style={styles.countryCode}>+91</Text>
                <TextInput
                  style={styles.input}
                  placeholder="9876543210"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={(text) => {
                    // Only allow 10 digits input
                    if (/^\d{0,10}$/.test(text)) {
                      setPhoneNumber(text);
                    }
                  }}
                  onFocus={() => setIsFocused(prev => ({ ...prev, phone: true }))}
                  onBlur={() => setIsFocused(prev => ({ ...prev, phone: false }))}
                  maxLength={10}
                />
              </View>
              <Text style={styles.inputHint}>
                We'll send you a verification code
              </Text>
            </View>

            {/* Button Section */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.signupButton,
                  ( phoneNumber.length < 10) && styles.signupButtonDisabled
                ]}
                onPress={handleSignup}
                disabled={ phoneNumber.length < 10}
              >
                <Text style={styles.signupButtonText}>Create Account</Text>
              </TouchableOpacity>

              <View style={styles.loginPromptContainer}>
                <Text style={styles.loginPromptText}>
                    Already have an account?{' '}
                    <TouchableOpacity onPress={() => navigation.navigate('/(routes)/login')}>
                    <Text style={styles.loginLink}>Login</Text>
                    </TouchableOpacity>
                </Text>
            </View>


              <View style={styles.termsContainer}>
                <Text style={styles.termsText}>
                  By continuing, you agree to our{' '}
                  <Text style={styles.termsLink}>Terms of Service</Text>
                  {' '}and{' '}
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
  signupButton: {
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
  signupButtonDisabled: {
    backgroundColor: '#94A3B8',
    shadowOpacity: 0,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginPromptContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  loginPromptText: {
    fontSize: 14,
    color: '#6B7280',
  },
  loginLink: {
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

export default SignupScreen;