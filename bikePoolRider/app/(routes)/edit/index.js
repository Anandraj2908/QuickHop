import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useNavigation } from 'expo-router';

const isValidVehicleNumber = (number) => {
  const indianVehicleRegex = /^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/;
  const bhSeriesRegex = /^BH\d{2}[A-Z]{2}\d{4}$/;
  return indianVehicleRegex.test(number) || bhSeriesRegex.test(number);
};

const isValidDrivingLicense = (license) => {
  const indianLicenseRegex = /^[A-Z]{2}\d{13}$/;
  return indianLicenseRegex.test(license);
};

const isValidPhoneNumber = (phone) => {
  const phoneRegex = /^\+91\d{10}$/;
  return phoneRegex.test(phone);
};

const ProfileEditScreen = () => {
  const navigation = useNavigation();
  const {
    vehicleManufacturer,
    vehicleModel,
    vehicleNumber,
    phoneNumber,
    vehicleRegistrationCertificate,
  } = useLocalSearchParams();

  const [formData, setFormData] = useState({
    vehicleManufacturer: vehicleManufacturer || '',
    vehicleModel: vehicleModel || '',
    vehicleNumber: vehicleNumber || '',
    phoneNumber: phoneNumber || '',
    vehicleRegistrationCertificate: vehicleRegistrationCertificate || '',
  });
  const [showModal, setShowModal] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const validateForm = () => {
    if (!isValidVehicleNumber(formData.vehicleNumber)) {
      Alert.alert('Invalid Input', 'Please enter a valid vehicle number.');
      return false;
    }
    if (!isValidPhoneNumber(formData.phoneNumber)) {
      Alert.alert('Invalid Input', 'Please enter a valid phone number with +91 prefix.');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setShowModal(true);
    }
  };

  const handleReSubmit = () => {
    setShowModal(false);
    alert('Request submitted successfully! Note that your request will be reviewed by the admin. You will be notified once your request is approved. NOTE: If you have submitted phone number change request , later if you are unable to login by this number , please try to login using the new number with same password. Thank you');
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back-circle" size={40} color="#ffffff" />
      </TouchableOpacity>
      <Text style={styles.title}>Request Profile Edit</Text>
      {[
        { label: 'Vehicle Manufacturer', key: 'vehicleManufacturer', icon: 'bike' },
        { label: 'Vehicle Model', key: 'vehicleModel', icon: 'motorbike' },
        { label: 'Vehicle Number', key: 'vehicleNumber', icon: 'numeric' },
        { label: 'Phone Number', key: 'phoneNumber', icon: 'phone' },
        { label: 'Registration Certificate', key: 'vehicleRegistrationCertificate', icon: 'certificate' },
      ].map((item, index) => (
        <View key={index} style={styles.inputContainer}>
          <MaterialCommunityIcons name={item.icon} size={20} color="#ffffff" />
          <TextInput
            style={styles.input}
            placeholder={item.label}
            placeholderTextColor="rgba(255, 255, 255, 0.6)"
            value={formData[item.key]}
            onChangeText={(value) => handleInputChange(item.key, value)}
          />
        </View>
      ))}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit Request</Text>
      </TouchableOpacity>
      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Reconfirm Details </Text>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>
                <Text style={styles.boldText}>Vehicle Manufacturer: </Text>
                {formData.vehicleManufacturer}
              </Text>
              <Text style={styles.modalText}>
                <Text style={styles.boldText}>Vehicle Model: </Text>
                {formData.vehicleModel}
              </Text>
              <Text style={styles.modalText}>
                <Text style={styles.boldText}>Vehicle Number: </Text>
                {formData.vehicleNumber}
              </Text>
              <Text style={styles.modalText}>
                <Text style={styles.boldText}>Phone Number: </Text>
                {formData.phoneNumber}
              </Text>
              <Text style={styles.modalText}>
                <Text style={styles.boldText}>Registration Certificate: </Text>
                {formData.vehicleRegistrationCertificate}
              </Text>
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalButton} onPress={() => setShowModal(false)}>
                <Ionicons name="close-circle-outline" size={20} color="#ffffff" />
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={handleReSubmit}>
                <Ionicons name="checkmark-circle-outline" size={20} color="#ffffff" />
                <Text style={styles.modalButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 30, 30, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    color: '#ffffff',
  },
  submitButton: {
    backgroundColor: 'rgba(255, 105, 180, 0.4)',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 105, 180, 0.6)',
  },
  submitButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContainer: {
    backgroundColor: '#1e1e1e',
    borderRadius: 16,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  modalContent: {
    marginBottom: 20,
  },
  modalText: {
    fontSize: 16,
    color: '#ffffff',
    marginVertical: 5,
  },
  boldText: {
    fontWeight: 'bold',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 105, 180, 0.4)',
    padding: 10,
    borderRadius: 12,
    marginHorizontal: 5,
  },
  modalButtonText: {
    color: '#ffffff',
    marginLeft: 5,
  },
});

export default ProfileEditScreen;
