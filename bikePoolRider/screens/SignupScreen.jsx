import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    StyleSheet, 
    SafeAreaView, 
    ScrollView, 
    Modal,
    ActivityIndicator, 
    Alert
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import Toast from '../components/Toast';
import { LinearGradient } from 'expo-linear-gradient';

export default function RegistrationScreen() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [vehicleModel, setVehicleModel] = useState('');
    const [vehicleManufacturer, setVehicleManufacturer] = useState('');
    const [drivingLicense, setDrivingLicense] = useState('');
    const [vehicleRegistrationCertificate, setVehicleRegistrationCertificate] = useState('');
    const [upiId, setUpiId] = useState('');
    const [gender, setGender] = useState('');
    const [pin, setPin] = useState('');
    const [showPinModal, setShowPinModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const { phoneNumber } = useLocalSearchParams();
    const router = useRouter();

    const isValidVehicleNumber = (number) => {
        const indianVehicleRegex = /^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/;
        const bhSeriesRegex = /^BH\d{2}[A-Z]{2}\d{4}$/;
        return indianVehicleRegex.test(number) || bhSeriesRegex.test(number);
    };
  

    const isValidDrivingLicense = (license) => {
        const indianLicenseRegex = /^[A-Z]{2}\d{13}$/;
        return indianLicenseRegex.test(license);
    };

    const handleKeyPress = (key) => {
        if (pin.length < 6) {
            setPin(prev => prev + key);
        }
    };
    
    const handleDelete = () => {
        setPin(prev => prev.slice(0, -1));
    };

    const CustomKeypad = () => (
        <View style={styles.keypadContainer}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
                <TouchableOpacity
                    key={num}
                    style={styles.keypadButton}
                    onPress={() => handleKeyPress(num.toString())}
                >
                    <Text style={styles.keypadText}>{num}</Text>
                </TouchableOpacity>
            ))}
            <TouchableOpacity
                style={styles.keypadButton}
                onPress={handleDelete}
            >
                <Ionicons name="backspace-outline" size={24} color="#fff" />
            </TouchableOpacity>
        </View>
    );

    const handleRegistration = async () => {
        try {
            if (!firstName || !lastName || !pin || !gender || 
                !vehicleNumber || !vehicleModel || !vehicleManufacturer || 
                !drivingLicense || !vehicleRegistrationCertificate || !upiId) {
                Toast.show('Please fill all fields');
                return;
            }

            if (pin.length !== 6) {
                Toast.show('Please enter a 6-digit PIN');
                return;
            }

            if (!isValidVehicleNumber(vehicleNumber)) {
                Toast.show('Invalid Vehicle Number. Use Indian format or BH series');
                return;
            }

            if (!isValidDrivingLicense(drivingLicense)) {
                Toast.show('Invalid Driving License. Use Indian format');
                return;
            }

            setLoading(true);
            const response = await axios.post(`${process.env.EXPO_PUBLIC_SERVER_URI}/riders/signup`, {
                firstName,
                lastName,
                password: pin,
                phoneNumber,
                gender,
                vehicleNumber,
                vehicleModel,
                vehicleManufacturer,
                drivingLicense,
                vehicleRegistrationCertificate,
                upiId
            });
            
            Alert.alert("Registration successful", "You can now login with your phone number and PIN");
            router.replace("/(routes)/login");
        } catch (error) {
            console.log("Registration error: ", error);
            Toast.show("An error occurred, please try again");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#000000', '#1a1a1a']} style={styles.container}>
                <ScrollView 
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                >
                    <Toast/>
                    <Text style={styles.title}>Create Account</Text>
                    <View style={styles.nameContainer}>
                        <View style={[styles.inputContainer, { width: '48%' }]}>
                            <Ionicons name="person-outline" size={20} color="#888" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="First Name"
                                placeholderTextColor="#666"
                                value={firstName}
                                onChangeText={setFirstName}
                            />
                        </View>
                        <View style={[styles.inputContainer, { width: '48%' }]}>
                            <Ionicons name="person-outline" size={20} color="#888" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Last Name"
                                placeholderTextColor="#666"
                                value={lastName}
                                onChangeText={setLastName}
                            />
                        </View>
                    </View>
                    <View style={styles.inputContainer}>
                        <MaterialCommunityIcons name="motorbike" size={20} color="#888" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Vehicle Number in Indian Format"
                            placeholderTextColor="#666"
                            value={vehicleNumber}
                            onChangeText={setVehicleNumber}
                            autoCapitalize="characters"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                    <MaterialCommunityIcons name="motorbike" size={20} color="#888" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Vehicle Model"
                            placeholderTextColor="#666"
                            value={vehicleModel}
                            onChangeText={setVehicleModel}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Ionicons name="business-outline" size={20} color="#888" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Vehicle Manufacturer"
                            placeholderTextColor="#666"
                            value={vehicleManufacturer}
                            onChangeText={setVehicleManufacturer}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Ionicons name="document-text-outline" size={20} color="#888" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Driving License"
                            placeholderTextColor="#666"
                            value={drivingLicense}
                            onChangeText={setDrivingLicense}
                            autoCapitalize="characters"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Ionicons name="document-attach-outline" size={20} color="#888" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Vehicle Registration Certificate"
                            placeholderTextColor="#666"
                            value={vehicleRegistrationCertificate}
                            onChangeText={setVehicleRegistrationCertificate}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Ionicons name="cash-outline" size={20} color="#888" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="UPI ID"
                            placeholderTextColor="#666"
                            value={upiId}
                            onChangeText={setUpiId}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <TouchableOpacity 
                            style={styles.pinInputContainer}
                            onPress={() => setShowPinModal(true)}
                        >
                            <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.inputIcon} />
                            <Text style={styles.pinPlaceholder}>
                                {pin ? '• '.repeat(pin.length) : 'Enter 6-digit PIN'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.genderContainer}>
                        <TouchableOpacity 
                            style={[
                                styles.genderButton, 
                                gender === 'Male' && styles.selectedGenderButtonMale
                            ]}
                            onPress={() => setGender('Male')}
                        >
                            <Ionicons 
                                name="male-outline" 
                                size={24} 
                                color={gender === 'Male' ? '#fff' : '#a3cef1'} 
                            />
                            <Text style={[
                                styles.genderButtonText, 
                                gender === 'Male' && styles.selectedGenderButtonText
                            ]}>Male</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[
                                styles.genderButton, 
                                gender === 'Female' && styles.selectedGenderButtonFemale
                            ]}
                            onPress={() => setGender('Female')}
                        >
                            <Ionicons 
                                name="female-outline" 
                                size={24} 
                                color={gender === 'Female' ? '#fff' : '#f4acb7'} 
                            />
                            <Text style={[
                                styles.genderButtonText, 
                                gender === 'Female' && styles.selectedGenderButtonText 
                            ]}>Female</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity 
                        style={styles.registerButton}
                        onPress={handleRegistration}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={styles.registerButtonText}>Register</Text>
                        )}
                    </TouchableOpacity>
                </ScrollView>

                <Modal
                    visible={showPinModal}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setShowPinModal(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <TouchableOpacity 
                                style={styles.closeButton}
                                onPress={() => setShowPinModal(false)}
                            >
                                <Ionicons name="close" size={24} color="#fff" />
                            </TouchableOpacity>

                            <Text style={styles.modalTitle}>Enter 6-digit PIN</Text>
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

                            <CustomKeypad />

                            {pin.length === 6 && (
                                <TouchableOpacity
                                    style={styles.continueButton}
                                    onPress={() => setShowPinModal(false)}
                                >
                                    <Text style={styles.continueButtonText}>Confirm PIN</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </Modal>
            </LinearGradient>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingTop: 50,
    },
    nameContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    title: {
        fontSize: 24,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 30,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
        borderRadius: 10,
        marginBottom: 15,
        paddingLeft: 10,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 50,
        color: '#fff',
    },
    pinInputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
    },
    pinPlaceholder: {
        color: '#666',
        fontSize: 16,
    },
    genderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    genderButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        width: '48%',
    },
    selectedGenderButtonMale: {
        backgroundColor: '#a3cef1',
    },
    selectedGenderButtonFemale: {
        backgroundColor: '#f4acb7',
    },
    genderButtonText: {
        color: '#888',
        marginLeft: 10,
    },
    selectedGenderButtonText: {
        color: '#fff',
    },
    registerButton: {
        backgroundColor: '#4a6fff',
        borderRadius: 10,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    registerButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
      backgroundColor: '#1a1a1a',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingTop: 30,
      paddingHorizontal: 10,
      paddingBottom: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 10,
    },
    modalTitle: {
        fontSize: 20,
        color: '#fff',
        marginBottom: 20,
    },
    pinContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '70%',
        marginBottom: 20,
    },
    pinDot: {
        width: 15,
        height: 15,
        borderRadius: 7.5,
        backgroundColor: '#666',
    },
    pinDotFilled: {
        backgroundColor: '#4a6fff',
    },
    keypadContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '80%',
        marginBottom: 30,
    },
    keypadButton: {
        width: '30%',
        height: 60,
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginBottom: 10,
    },
    keypadText: {
        fontSize: 20,
        color: '#fff',
    },
    continueButton: {
        backgroundColor: '#4a6fff',
        borderRadius: 10,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    continueButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
  });
