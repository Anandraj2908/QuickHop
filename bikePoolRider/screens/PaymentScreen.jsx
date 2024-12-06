import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import UPIIcon from '../components/UPIIcon';
import { useGetDriverData } from '../hooks/useGetRiderData';
import QRCode from 'react-native-qrcode-svg';

const PaymentScreen = () => {
  const router = useRouter();
  const { driver, loading } = useGetDriverData();
  const {fare} = useLocalSearchParams();
  const handlePaymentReceived = () => {
    Alert.alert("Payment Status", "Payment has been received!");
    router.replace('/home');
  };

  const upiQRCode = driver?.upiId && fare ? 
  `upi://pay?pa=${driver.upiId}&pn=${encodeURIComponent(driver.firstName + ' ' + driver.lastName)}&am=${fare}&cu=INR` : 
  null;
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.thanks}>Thank you for riding with us!</Text>
      <Ionicons name="cash-outline" size={80} color="#4CAF50" style={styles.icon} />
      
      <View style={styles.titleContainer}>
      <UPIIcon width={100} height={40} />
        <Text style={styles.title}> The Indian Way to Pay!</Text>
        
      </View>
      
      {upiQRCode ? (
        <QRCode
          value={upiQRCode} 
          size={250}    
          color="#4CAF50"  
          backgroundColor="#121212" 
          style={styles.qrImage}
        />
      ) : (
        <Image
          source={{ uri: 'https://via.placeholder.com/250?text=QR+Code' }}
          style={styles.qrImage}
        />
      )}
      

      <TouchableOpacity style={styles.button} onPress={handlePaymentReceived}>
        <Text style={styles.buttonText}>Payment Received</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', 
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
  },
  thanks: {
    fontSize: 24,
    color: '#4CAF50',
    marginBottom: 100,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  icon: {
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',  
    alignItems: 'center', 
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50', 
    marginRight: 10,   
  },
  qrImage: {
    width: 250,
    height: 250,
    marginBottom: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderStyle: 'dashed',
  },
  button: {
    backgroundColor: '#4CAF50', 
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 40,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaymentScreen;
