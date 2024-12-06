import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import axios from 'axios';
import Toast from "../components/Toast";

const OTPVerificationScreen = () => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [timer, setTimer] = useState(60); 
    const [isCheckingPhoneAlreadyExists, setIsCheckingPhoneAlreadyExists] = useState(false);
    const router = useRouter();

    useEffect(() => {
        let interval;
        if (showOtpModal && timer > 0) {
          interval = setInterval(() => {
            setTimer((prevTimer) => prevTimer - 1);
          }, 1000);
        } else if (timer === 0) {
          clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [showOtpModal, timer]);

    const handleSendOtp = async () => {
      setError("");
        if (phoneNumber.length === 10) {
          try {
            setIsCheckingPhoneAlreadyExists(true);
            const response = await axios.get(
              `${process.env.EXPO_PUBLIC_SERVER_URI}/users/get-user-by-phonenumber`,
              {
                params: { phoneNumber: `+91${phoneNumber}` }, 
                timeout: 10000,
                headers: { "Content-Type": "application/json" }
              }
            );
               
            if(response.data.success) {
              setError("Phone number already registered. Try logging in.");
              return;
            }
            await axios.post(`${process.env.EXPO_PUBLIC_SERVER_URI}/users/sendotp`, { phoneNumber: `+91${phoneNumber}` });
            setShowOtpModal(true);
            setError("");
            setTimer(60);
          } catch (error) {
            console.error("Error fetching data: ", error);
            setError("Failed to send OTP. Please try again.");
          } finally {
            setIsCheckingPhoneAlreadyExists(false);
          }
        } else {
          setError("Enter a valid 10-digit phone number.");
        }
    };
      

  const handleResendOtp = () => {
    if (timer === 0) {
      setTimer(60); 
      setOtp(""); 
      handleSendOtp();
      alert("OTP Resent!");
    }
  };
  

  const handleOtpChange = (digit) => {
    if (otp.length < 6) {
      setOtp((prevOtp) => prevOtp + digit);
    }
  };

  const handleOtpBackspace = () => {
    setOtp((prevOtp) => prevOtp.slice(0, -1));
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
        setError("Please enter the 6-digit OTP.");
        return;
    }

    try {

        await axios.post(
            `${process.env.EXPO_PUBLIC_SERVER_URI}/users/verifyotp`,
            { 
                phoneNumber: `+91${phoneNumber}`, 
                code: otp 
            }
        );

        alert("OTP Verified!");
        router.replace({
          pathname: "/(routes)/signup/registration",
          params: { phoneNumber: `+91${phoneNumber}` },
        });
        setShowOtpModal(false);
        setOtp("");
    } catch (error) {
        console.error("Error verifying OTP: ", error.message);
        setError("Invalid OTP. Please try again.");
    }
};


  const CustomKeypad = () => {
    const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
    return (
      <View style={styles.keypad}>
        {digits.map((digit, index) => (
          <TouchableOpacity
            key={index}
            style={styles.keypadButton}
            onPress={() => handleOtpChange(digit)}
          >
            <Text style={styles.keypadButtonText}>{digit}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[styles.keypadButton, { backgroundColor: "#ff5757" }]}
          onPress={handleOtpBackspace}
        >
          <Ionicons name="backspace" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  };
  const handleLoginRedirect = () => {
    
    router.replace("/(routes)/login");
  };
  

  return (
    <View style={styles.container}>
      <Toast />
      <Text style={styles.title}>Verify to Continue</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.prefix}>+91</Text>
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          placeholder="Enter phone number"
          placeholderTextColor="#888"
          maxLength={10}
          value={phoneNumber}
          onChangeText={(text) => setPhoneNumber(text)}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <TouchableOpacity style={styles.sendOtpButton} onPress={handleSendOtp}>
        <Text style={styles.buttonText}>Send OTP</Text>
      </TouchableOpacity>
      <View style={styles.signedInContainer}>
        <Text style={styles.signedInText}>
            Already signed in? 
        </Text>
        <TouchableOpacity onPress={handleLoginRedirect}>
            <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
      </View>
      <Modal
        visible={showOtpModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setShowOtpModal(false);
          setOtp("");
          setError("");
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setShowOtpModal(false);
                setOtp("");
                setError("");
              }}
            >
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Enter OTP</Text>
            <Text style={styles.modalSubtitle}>Enter the 6-digit OTP sent to your phone</Text>
            {error && <Text style={styles.errorText}>{error}</Text>}
            <View style={styles.otpContainer}>
              {Array.from({ length: 6 }).map((_, index) => (
                <Text key={index} style={styles.otpDigit}>
                  {otp[index] || "_"}
                </Text>
              ))}
            </View>

            <View style={styles.timerContainer}>
              <Text style={styles.timerText}>
                {timer > 0
                  ? `Resend OTP in ${timer} seconds`
                  : "Didn't receive the OTP?"}
              </Text>
              {timer === 0 && (
                <TouchableOpacity onPress={handleResendOtp}>
                  <Text style={styles.resendOtpText}>Resend OTP</Text>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              style={styles.verifyButton}
              onPress={handleVerifyOtp}
            >
              <Text style={styles.buttonText}>Verify</Text>
            </TouchableOpacity>
            <CustomKeypad />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e1e1e",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    width: "100%",
  },
  prefix: {
    color: "#fff",
    fontSize: 16,
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    paddingVertical: 10,
  },
  errorText: {
    color: "#ff5757",
    fontSize: 14,
    marginBottom: 10,
  },
  sendOtpButton: {
    backgroundColor: "#1e88e5",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#1e1e1e",
    margin: 20,
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  closeButton: {
    alignSelf: "flex-end",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 20,
    marginBottom: 10,
  },
  modalSubtitle: {
    color: "#aaa",
    fontSize: 14,
    marginBottom: 20,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  otpDigit: {
    color: "#fff",
    fontSize: 20,
    marginHorizontal: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#4a6fff",
  },
  timerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  timerText: {
    color: "#aaa",
    fontSize: 14,
  },
  resendOtpText: {
    color: "#4a6fff",
    fontSize: 14,
    marginTop: 5,
  },
  verifyButton: {
    backgroundColor: "#4a6fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
  },
  keypad: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  keypadButton: {
    width: 60,
    height: 60,
    backgroundColor: "#2a2a2a",
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
  keypadButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  signedInContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  signedInText: {
    color: "#aaa",
    fontSize: 14,
    marginBottom: 10,
  },
  loginText: {
    color: "#4a6fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default OTPVerificationScreen;
