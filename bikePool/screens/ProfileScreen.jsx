import React, { useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, Alert, SafeAreaView, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons, FontAwesome, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import useGetUserData from '../hooks/useGetUserData';
import { router } from 'expo-router';
import DarkCover from '../assets/images/dark-cover.jpg';
export default function ProfileScreen() {
  const { loading, user } = useGetUserData();
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading Profile...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Edit Button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.editButton}>
          <Feather name="edit-2" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.profileImageContainer}>
          <Image source={DarkCover} style={styles.profileImage} />
        </View>
        <Text style={styles.name}>{user.firstName} {user.lastName}</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statsCard}>
          <Text style={styles.statsValue}>5</Text>
          <Text style={styles.statsLabel}>Rides</Text>
        </View>
        <View style={styles.statsCard}>
          <Text style={styles.statsValue}>5</Text>
          <Text style={styles.statsLabel}>Rating</Text>
        </View>
        <View style={styles.statsCard}>
          <Text style={styles.statsValue}>₹ 50</Text>
          <Text style={styles.statsLabel}>Spent</Text>
        </View>
      </View>

      {/* User Information */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Account Details</Text>
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Feather name="mail" size={20} color="#666" />
            <View>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>abcd@gmail.com</Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <Feather name="phone" size={20} color="#666" />
            <View>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{user.phoneNumber}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} disabled={isLoggingOut}>
        <Feather name="log-out" size={20} color="#fff" />
        <Text style={styles.logoutText}>
          {isLoggingOut ? 'Logging Out...' : 'Logout'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

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
    backgroundColor: 'rgba(255, 105, 180, 0.3)', // Translucent pink
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
    borderColor: 'rgba(255, 105, 180, 0.3)', // Translucent pink border
    elevation: 5,
    shadowColor: '#FF69B4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginBottom: 16,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textShadowColor: 'rgba(255, 105, 180, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    marginBottom: 5,
    marginTop: 10,
  },
  statsCard: {
    backgroundColor: 'rgba(40, 40, 40, 0.7)',
    borderRadius: 16,
    padding: 12,
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
    paddingHorizontal: 20,
    paddingVertical: 10,
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
    backgroundColor: 'rgba(30, 30, 30, 0.6)', // Slightly darker than parent
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  infoLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)', // Semi-transparent white
  },
  infoValue: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 105, 180, 0.2)', // Translucent pink
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
});