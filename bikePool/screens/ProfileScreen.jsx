import React, { useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, Alert, SafeAreaView, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons, FontAwesome, FontAwesome6, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import useGetUserData from '../hooks/useGetUserData';
import { router } from 'expo-router';
import DarkCover from '../assets/images/dark-cover.jpg';
import specialDates from '../constants/specialDates';
import RiderGenderPreferenceSlider from '../components/RiderGenderPreferenceSlider';
import axios from "axios";
export default function ProfileScreen() {
  const { loading, user } = useGetUserData();
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

  const onPreferenceChange = async(preference) => {
    try{
        const accessToken = await AsyncStorage.getItem("accessToken");
        if(!accessToken){
            throw new Error("No access token found");
        }

        await axios.patch(
          `${process.env.EXPO_PUBLIC_SERVER_URI}/users/change-rider-gender-preference`, 
          {
            preference,  
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`, 
            },
          }
        );
        
    } catch(err){
        console.log("Error changing preference", err);
    } 
  }

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
      

      <View style={styles.profileSection}>
        <View style={styles.profileImageContainer}>
          <Image source={DarkCover} style={styles.profileImage} />
        </View>
        <Text style={styles.name}>{user.firstName} {user.lastName}</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statsCard}>
          <Text style={styles.statsValue}>{user.totalRides}</Text>
          <Text style={styles.statsLabel}>Rides</Text>
        </View>
        <View style={styles.statsCard}>
          <Text style={styles.statsValue}>₹ {user.totalSpending}</Text>
          <Text style={styles.statsLabel}>Spent</Text>
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Account Detail</Text>
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Feather name="phone" size={20} color="#666" />
            <View>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{user.phoneNumber}</Text>
            </View>
          </View>
          <RiderGenderPreferenceSlider user={user} onPreferenceChange={onPreferenceChange}/>
        </View>
      </View>
      <View style={styles.greetSection}>
      <MaterialCommunityIcons name="party-popper" size={24} color="#666" />
        <View style={styles.infoGrid}>
        <Text style={styles.infoLabel}>
          Guess what? You officially joined our awesome tribe on {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}! Wanna know the magic behind that day? ✨
        </Text>
        <Text style={styles.greetValue}>{specialDates[user.createdAt.slice(5,10)]}</Text>
        </View>
      </View>

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
    justifyContent:'center'
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
    marginBottom: 5,
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
    marginTop: 5,
  },
  statsCard: {
    backgroundColor: 'rgba(40, 40, 40, 0.7)',
    borderRadius: 16,
    padding: 5,
    alignItems: 'center',
    minWidth: 130,
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
    marginVertical: 10,
    marginHorizontal: 20,
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  infoGrid: {
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
  greetSection:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(30, 30, 30, 0.6)', 
    padding: 12,
    paddingHorizontal:25,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    marginHorizontal: 20,
  },
  greetValue: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
    marginLeft: 8,
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
});