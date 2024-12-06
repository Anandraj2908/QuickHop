import React, { useState, useCallback, useEffect } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    StyleSheet, 
    SafeAreaView, 
    ScrollView, 
    Modal,
    Platform,
    ActivityIndicator, 
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import Toast from '../components/Toast';
import { LinearGradient } from 'expo-linear-gradient';

export default function RegistrationScreen() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [pin, setPin] = useState('');
    const [gender, setGender] = useState('');
    const [showPinModal, setShowPinModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { phoneNumber } = useLocalSearchParams();
    const router = useRouter();

    const handleKeyPress = useCallback((key) => {
        if (pin.length < 6) {
            setPin(prev => prev + key);
        }
    }, [pin]);
    
    const handleDelete = useCallback(() => {
        setPin(prev => prev.slice(0, -1));
    }, []);

    const CustomKeypad = useCallback(() => (
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
    ), [handleKeyPress, handleDelete]);

    const handleRegistration = async () => {
        try {
            if (firstName === '' || lastName === '' || pin === '' || gender === '') {
                Toast.show('Please fill all fields');
                return;
            }

            if (pin.length !== 6) {
                Toast.show('Please enter a 6-digit PIN');
                return;
            }

            setLoading(true);
            const response = await axios.post(`${process.env.EXPO_PUBLIC_SERVER_URI}/users/signup`, {
                firstName,
                lastName,
                password: pin,
                phoneNumber,
                gender
            });
            
            Alert.alert("Registration successful", "You can now login with your phone number and PIN", )
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
                    <View style={styles.inputContainer}>
                        <Ionicons name="person-outline" size={20} color="#888" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="First Name"
                            placeholderTextColor="#666"
                            value={firstName}
                            onChangeText={setFirstName}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Ionicons name="person-outline" size={20} color="#888" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Last Name"
                            placeholderTextColor="#666"
                            value={lastName}
                            onChangeText={setLastName}
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
        padding: 20,
    },
    closeButton: {
        alignSelf: 'flex-end',
        marginBottom: 10,
    },
    modalTitle: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
    },
    pinContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    pinDot: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#666',
        marginHorizontal: 5,
    },
    pinDotFilled: {
        backgroundColor: '#4a6fff',
    },
    keypadContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    keypadButton: {
        width: '30%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
        backgroundColor: '#2a2a2a',
        borderRadius: 10,
    },
    keypadText: {
        color: '#fff',
        fontSize: 24,
    },
    continueButton: {
        backgroundColor: '#4a6fff',
        borderRadius: 10,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    continueButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});