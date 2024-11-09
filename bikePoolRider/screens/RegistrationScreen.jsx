import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';

const RegistrationScreen = () => {
  const [formData, setFormData] = useState({
    phoneNumber: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    vehicleNumber: '',
    vehicleModel: '',
    isElectric: false, // Assuming you want a toggle for electric
    vehicleManufacturer: '',
    drivingLicense: '',
    vehicleRegistrationCertificate: '',
  });

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rider Registration</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChangeText={(value) => handleChange('phoneNumber', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={formData.email}
          onChangeText={(value) => handleChange('email', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={formData.firstName}
          onChangeText={(value) => handleChange('firstName', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={formData.lastName}
          onChangeText={(value) => handleChange('lastName', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={formData.password}
          onChangeText={(value) => handleChange('password', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Vehicle Number"
          value={formData.vehicleNumber}
          onChangeText={(value) => handleChange('vehicleNumber', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Vehicle Model"
          value={formData.vehicleModel}
          onChangeText={(value) => handleChange('vehicleModel', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Vehicle Manufacturer"
          value={formData.vehicleManufacturer}
          onChangeText={(value) => handleChange('vehicleManufacturer', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Driving License"
          value={formData.drivingLicense}
          onChangeText={(value) => handleChange('drivingLicense', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Vehicle Registration Certificate"
          value={formData.vehicleRegistrationCertificate}
          onChangeText={(value) => handleChange('vehicleRegistrationCertificate', value)}
        />
        
        {/* Here you could add a toggle for isElectric if needed */}
        <Button title="Register" onPress={() => {}} /> {/* No functionality */}
      </ScrollView>
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
  scrollContainer: {
    paddingBottom: 20,
  },
});

export default RegistrationScreen;
