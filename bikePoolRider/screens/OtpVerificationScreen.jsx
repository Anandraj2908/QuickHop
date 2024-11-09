import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const OtpVerificationScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter 6-digit code"
        keyboardType="number-pad"
        maxLength={6} // Restrict input to 6 digits
        // onChangeText={setOtp} // Commented out for design only
      />

      <Button title="Next" onPress={() => {}} /> {/* No functionality */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
});

export default OtpVerificationScreen;
