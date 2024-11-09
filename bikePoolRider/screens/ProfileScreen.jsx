import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useGetDriverData } from '../hooks/useGetRiderData';
import { router } from 'expo-router';

const ProfileScreen = () => {
    const {loading, driver} = useGetDriverData();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await AsyncStorage.removeItem('accessToken'); 
      router.navigate('/login')
    } catch (error) {
      Alert.alert('Logout Error', 'Failed to log out. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (loading || !driver) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Rider data unavailable.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileContainer}>
        <Text style={styles.name}>{driver.firstName} {driver.lastName}</Text>
        <Text style={styles.phone}>📞 {driver.phoneNumber}</Text>
        <Text style={styles.vehicleDetails}>🚗 {driver.vehicleManufacturer} {driver.vehicleModel}</Text>
        <Text style={styles.vehicleNumber}>🆔 {driver.vehicleNumber}</Text>
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{driver.totalRides}</Text>
          <Text style={styles.statLabel}>Total Rides</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>${driver.totalEarning}</Text>
          <Text style={styles.statLabel}>Earnings</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{driver.ratings}</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
      </View>
    
      <View style={styles.vehicleInfoContainer}>
        <Text style={styles.sectionTitle}>Vehicle Information</Text>
        <Text style={styles.infoText}>🚗 Manufacturer: {driver?.vehicleManufacturer}</Text>
        <Text style={styles.infoText}>🚙 Model: {driver?.vehicleModel}</Text>
        <Text style={styles.infoText}>🆔 License Plate: {driver?.vehicleNumber}</Text>
        <Text style={styles.infoText}>📜 Driving License: {driver?.drivingLicense}</Text>
    </View>
      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} disabled={isLoggingOut}>
        <Text style={styles.logoutText}>{isLoggingOut ? 'Logging Out...' : 'Logout'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
    marginTop: 30,
  },
  profileContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  phone: {
    fontSize: 16,
    color: '#6b7280',
    marginVertical: 4,
  },
  vehicleDetails: {
    fontSize: 16,
    color: '#4b5563',
  },
  vehicleNumber: {
    fontSize: 16,
    color: '#4b5563',
    marginVertical: 4,
  },
  status: {
    fontSize: 16,
    fontWeight: '500',
    color: '#10b981',
    marginTop: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statCard: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    width: '30%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  logoutButton: {
    padding: 16,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
  },
  vehicleInfoContainer: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  infoText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
});

export default ProfileScreen;
