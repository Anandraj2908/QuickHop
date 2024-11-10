import { View, Text, StyleSheet, TouchableOpacity, Image, Linking, ActivityIndicator } from 'react-native';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import axios from 'axios';
import { getDistance } from 'geolib';
import * as GeoLocation from 'expo-location';
import { LOCATIONS } from '../constants/constants';
import Toast from '../components/Toast';
import MotorcycleCard from '../components/MotorCycleLoader';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RideDetails = () => {
  const [userData, setUserData] = useState(null);
  const [showStartRide, setShowStartRide] = useState(false);
  const [showEndRide, setShowEndRide] = useState(false);
  const [showRiding, setShowRiding] = useState(false);
  const [rideInfo, setRideInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchCurrentRide = useCallback(async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_SERVER_URI}/riders/get-current-ride`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.data.data) {
        setRideInfo(response.data.data);
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error("Error getting current ride:", error);
      return null;
    }
  }, []);

  const fetchUserData = useCallback(async (userId) => {
    if (!userId) return;
    
    try {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_SERVER_URI}/users/get-user-by-id/${userId}`
      );
      setUserData(response.data.data);
    } catch (err) {
      console.log("Error getting user data", err);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const rideData = await fetchCurrentRide();
        if (isMounted && rideData?.userId) {
          await fetchUserData(rideData.userId);
        }
      } catch (error) {
        console.error("Error in initial data fetch:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [fetchCurrentRide, fetchUserData]);

  // Location tracking effect
  useFocusEffect(
    useCallback(() => {
    if (!rideInfo?.currentLocationName || !rideInfo?.destinationLocationName) return;

    const pickUpLocation = LOCATIONS.find(location => location.name === rideInfo.currentLocationName);
    const dropLocation = LOCATIONS.find(location => location.name === rideInfo.destinationLocationName);

    if (!pickUpLocation || !dropLocation) return;

    let locationSubscription = null;

    const startLocationTracking = async () => {
      try {
        if (locationSubscription) locationSubscription.remove();
        locationSubscription = await GeoLocation.watchPositionAsync(
          {
            accuracy: GeoLocation.Accuracy.High,
            timeInterval: 1000,
            distanceInterval: 0.5,
          },
          (position) => {
            const { longitude, latitude } = position.coords;
            const newLocation = { latitude, longitude };
            const {lat, lng} = pickUpLocation;
            const pickupDistance = getDistance(newLocation, {latitude: lat, longitude: lng});
            if (pickupDistance < 2) {
              Toast.show("You are near the pickup location");
              setShowStartRide(true);
              setShowRiding(false);
              setShowEndRide(false);
            }

            const { lat: dropLat, lng: dropLng } = dropLocation;

            const dropDistance = getDistance(newLocation, { latitude: dropLat, longitude: dropLng });
            if (dropDistance < 2) {
              Toast.show("You are near the drop location");
              setShowRiding(false);
              setShowStartRide(false);
              setShowEndRide(true);
            }
          }
        );
      } catch (error) {
        console.error("Error starting location tracking:", error);
      }
    };

    startLocationTracking();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [rideInfo])
  );

  const handleBackPress = () => {
    router.back();
  };

  const handleCall = () => {
    if (!userData?.phoneNumber) {
      alert("Phone number not available");
      return;
    }
    const phoneUrl = `tel:${userData.phoneNumber}`;
    Linking.openURL(phoneUrl).catch((err) => {
      console.error("Failed to open dialer", err);
      alert("Unable to make a call at the moment.");
    });
  };

  const sendPushNotification = async (title, body, data) => {
    let message = {};
    message={
      to:"ExponentPushToken[ofS4h6DXUTnJL0KETIWKR3]",
      sound: 'default',
      title,
      body,
      data: { orderData: data },
    }

    try{
      await axios.post('https://exp.host/--/api/v2/push/send', message);
    } catch (err) {
      console.log("Error sending push notification:", err);
    }
  };

  const handleStartRide = async () => {
    try{
      await sendPushNotification("Ride Started", "Your ride has started", "started");
      setShowStartRide(false);
      setShowRiding(true);
    } catch (err) {
      console.log("Error starting ride:", err);
      alert("Failed to start ride. Please try again.");
    }
    
  };

  const handleEndRide = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const reqData = {
        rideId: rideInfo._id,
        rideStatus: "completed",
      };
      await axios.patch(
        `${process.env.EXPO_PUBLIC_SERVER_URI}/riders/update-ride-status`,
        reqData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      await sendPushNotification("Ride Ended", "Your ride has ended", "ended");
      router.push('/home');
    } catch (err) {
      console.log("Error ending ride:", err);
      alert("Failed to end ride. Please try again.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
        <Toast/>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ride Details</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.driverInfo}>
          <Image
            source={{ uri: 'https://via.placeholder.com/60' }}
            style={styles.driverImage}
          />
          <View style={styles.driverDetails}>
            <Text style={styles.driverName}>{userData?.firstName} {userData?.lastName}</Text>
            
          </View>
          <TouchableOpacity style={styles.callButton} onPress={handleCall}>
            <Ionicons name="call" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.vehicleInfo}>
          <Text style={styles.vehicleText}>
            Waiting at {rideInfo.currentLocationName}
          </Text>
        </View>
      </View>

      {/* Ride Info Card */}
      <View style={styles.card}>
        <View style={styles.rideInfoItem}>
          <Ionicons name="cash-outline" size={20} color="#666" />
          <View style={styles.rideInfoText}>
            <Text style={styles.infoLabel}>Fare</Text>
            <Text style={styles.infoValue}>₹{rideInfo.charge}</Text>
          </View>
        </View>
        <View style={styles.rideInfoItem}>
          <Ionicons name="map-outline" size={20} color="#666" />
          <View style={styles.rideInfoText}>
            <Text style={styles.infoLabel}>Distance</Text>
            <Text style={styles.infoValue}>{rideInfo.distance} Km</Text>
          </View>
        </View>
      </View>

      {/* Location Card */}
      <View style={styles.card}>
        <View style={styles.locationItem}>
          <View style={[styles.locationDot, { backgroundColor: '#4CAF50' }]} />
          <Text style={styles.locationText}>{rideInfo.currentLocationName}</Text>
        </View>
        <View style={styles.locationDivider} />
        <View style={styles.locationItem}>
          <View style={[styles.locationDot, { backgroundColor: '#F44336' }]} />
          <Text style={styles.locationText}>{rideInfo.destinationLocationName}</Text>
        </View>
      </View>

        {showStartRide  && (
            <TouchableOpacity style={styles.startButton} onPress={handleStartRide}>
                <Text style={styles.startButtonText}>Start Ride</Text>
            </TouchableOpacity>
        )}
        {showRiding && (
            <MotorcycleCard/>
        )}
        {showEndRide  && (
            <TouchableOpacity style={styles.startButton} onPress={handleEndRide}>
                <Text style={styles.startButtonText}>End Ride</Text>
            </TouchableOpacity>
        )}
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    elevation: 2,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  driverDetails: {
    flex: 1,
    marginLeft: 16,
  },
  driverName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  rating: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  callButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 25,
  },
  vehicleInfo: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  vehicleText: {
    fontSize: 16,
    color: '#666',
  },
  rideInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  rideInfoText: {
    marginLeft: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 2,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  locationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 16,
  },
  locationText: {
    flex: 1,
    fontSize: 16,
  },
  locationDivider: {
    height: 20,
    width: 1,
    backgroundColor: '#ddd',
    marginLeft: 5,
    marginVertical: 4,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RideDetails;