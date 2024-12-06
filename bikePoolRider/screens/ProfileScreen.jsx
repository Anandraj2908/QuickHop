import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useGetDriverData } from '../hooks/useGetRiderData';
import { router } from 'expo-router';
import DarkCover from '../assets/images/dark-cover.jpg';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

const ProfileScreen = () => {
    const {loading, driver} = useGetDriverData();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await AsyncStorage.removeItem('accessToken'); 
      router.replace('/login')
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
      <View style={styles.header}>
        <TouchableOpacity style={styles.editButton}>
          <Feather name="edit-2" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.profileImageContainer}>
          <Image
            source={DarkCover}
            style={styles.profileImage}
          />
        </View>
        <Text style={styles.name}>{driver.firstName} {driver.lastName}</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statsCard}>
          <Text style={styles.statsValue}>{driver.totalRides}</Text>
          <Text style={styles.statsLabel}>Sessions</Text>
        </View>
        <View style={styles.statsCard}>
          <Text style={styles.statsValue}>{driver.ratings}</Text>
          <Text style={styles.statsLabel}>Rating</Text>
        </View>
        <View style={styles.statsCard}>
          <Text style={styles.statsValue}>₹{driver.totalEarning}</Text>
          <Text style={styles.statsLabel}>Earned</Text>
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Vehicle Details</Text>
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
          <MaterialCommunityIcons name="motorbike" size={20} color="#666" />
            <View>
              <Text style={styles.infoLabel}>Vehicle</Text>
              <Text style={styles.infoValue}>{driver.vehicleManufacturer} {driver.vehicleModel}</Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <Feather name="credit-card" size={20} color="#666" />
            <View>
              <Text style={styles.infoLabel}>License No.</Text>
              <Text style={styles.infoValue}>{driver.vehicleNumber}</Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <Feather name="phone" size={20} color="#666" />
            <View>
              <Text style={styles.infoLabel}>Contact</Text>
              <Text style={styles.infoValue}>{driver.phoneNumber}</Text>
            </View>
          </View>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.logoutButton} 
        onPress={handleLogout} 
        disabled={isLoggingOut}
      >
        <Feather name="log-out" size={20} color="#fff" />
        <Text style={styles.logoutText}>
          {isLoggingOut ? 'Logging Out...' : 'Logout'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', 
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 30,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 105, 180, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 5,
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: 'rgba(255, 105, 180, 0.3)', 
    elevation: 5,
    shadowColor: '#FF69B4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginBottom: 16,
    overflow: 'hidden',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textShadowColor: 'rgba(255, 105, 180, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  badgeContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  badge: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 105, 180, 0.2)',
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 105, 180, 0.3)',
  },
  badgeText: {
    color: '#ffffff',
    marginLeft: 4,
    fontSize: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 10,
    marginTop: 10,
  },
  statsCard: {
    backgroundColor: 'rgba(40, 40, 40, 0.7)', 
    borderRadius: 16,
    padding: 6,
    alignItems: 'center',
    minWidth: 100,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statsValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statsLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  infoSection: {
    backgroundColor: 'rgba(40, 40, 40, 0.7)',
    borderRadius: 20,
    marginTop: 10,
    marginHorizontal: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  infoGrid: {
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(30, 30, 30, 0.6)', 
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  infoLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)', 
  },
  infoValue: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 105, 180, 0.2)', 
    marginHorizontal: 20,
    marginVertical: 20,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 105, 180, 0.3)',
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(18, 18, 18, 0.8)', 
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
});

export default ProfileScreen;
