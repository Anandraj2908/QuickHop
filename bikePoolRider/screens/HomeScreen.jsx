import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text, 
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Animated,
  Platform,
  Dimensions
} from 'react-native';
import { useGetDriverData } from '../hooks/useGetRiderData';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from "expo-notifications";
import * as GeoLocation from "expo-location";
import Toast from '../components/Toast';
import MapView, { Marker, Polyline } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import {  LOCATIONS, RATE_CHART } from '../constants/constants';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { useRouter } from 'expo-router';
import RideRequestModal from '../components/RideRequestModal';
import AcceptingRidesButton from '../components/AcceptRideButton';
const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const notificationListener = useRef(); 
  const router = useRouter();
  const [isAcceptingRides, setIsAcceptingRides] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [currentLocationName, setCurrentLocationName] = useState("");
  const [pickupId, setPickupId] = useState(1);
  const [dropoffId, setDropoffId] = useState(5);
  const [rideCharge, setRideCharge] = useState(0);
  const [destinationLocationName, setDestinationLocationName] = useState("");
  const [distance, setDistance] = useState();
  const [wsConnected, setWsConnected] = useState(false);
  const [marker, setMarker] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [lastLocation, setLastLocation] = useState(null);
  const ws = new WebSocket(`ws://${process.env.EXPO_PUBLIC_HOST_IP}:${process.env.EXPO_PUBLIC_SOCKET_PORT}`);
  const [region, setRegion] = useState({});
  const [rippleAnimation] = useState(new Animated.Value(0));
  const { loading, driver } = useGetDriverData(); 
  const [cancelTimeout, setCancelTimeout] = useState(null);
  const [isRideAcceptTriggered, setIsRideAcceptTriggered] = useState(false);
  const [isCancellationInProgress, setIsCancellationInProgress] = useState(false);
  const [isProcessingRide, setIsProcessingRide] = useState(false);
  const [isCurrentRide, setIsCurrentRide] = useState(false);
  const [rideDetails, setRideDetails ] = useState(null);
  
  
  //basic utility functions
  const haversineDistance = (coords1, coords2) => {
    const toRad = (x) => (x * Math.PI) / 180;
  
    const R = 6371e3;
    const lat1 = toRad(coords1.latitude);
    const lat2 = toRad(coords2.latitude);
    const deltaLat = toRad(coords2.latitude - coords1.latitude);
    const deltaLon = toRad(coords2.longitude - coords1.longitude);
  
    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    const distance = R * c;
    return distance;
  };

  const findRate = (pickupId, dropId) => {
    const rateInfo = RATE_CHART.find(
        (rate) => rate.pickupId === pickupId && rate.dropId === dropId
    );
    return rateInfo ? rateInfo.rate : 0;
  };



  //NOTIFICATIONS **

  //notification handler
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  //notification listener
  useEffect(() => {
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        const orderData = JSON.parse(notification.request.content.data.orderData);
  
        if (orderData) {
          setIsRideAcceptTriggered(false);
          setIsProcessingRide(false);
          setIsModalVisible(true);
          const timeout = setTimeout(() => {
            if (!isRideAcceptTriggered) cancelRideHandler();
          }, 25000);
          setCancelTimeout(timeout);
  
          setCurrentLocation({
            latitude: orderData.currentLocation.latitude,
            longitude: orderData.currentLocation.longitude,
          });
          setMarker({
            latitude: orderData.marker.latitude,
            longitude: orderData.marker.longitude,
          });
          setRegion({
            latitude: (orderData.currentLocation.latitude + orderData.marker.latitude) / 2,
            longitude: (orderData.currentLocation.longitude + orderData.marker.longitude) / 2,
            latitudeDelta: Math.abs(orderData.currentLocation.latitude - orderData.marker.latitude) * 2,
            longitudeDelta: Math.abs(orderData.currentLocation.longitude - orderData.marker.longitude) * 2,
          });
          setDistance(orderData.distance);
          setCurrentLocationName(orderData.currentLocationName || "");
          setDestinationLocationName(orderData.destinationLocationName || "");
          setUserData(orderData.user);
          setRideCharge(orderData.rideCharge);
        } else {
          console.error("Notification data missing required properties.");
        }
      });
  
    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
    };
  }, []);

  //call registerForPushNotificationsAsync
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  const registerForPushNotificationsAsync = async () => {
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        Toast.show({
          text: "Failed to get push token for push notification!",
          type: "danger",
        });
        return;
      }

      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId || Constants?.easConfig?.projectId;

      if (!projectId) {
        Toast.show({
          text: "Failed to get project id for push notification!",
          type: "danger",
        });
        return;
      }

      try {
        const pushTokenResponse = await Notifications.getExpoPushTokenAsync({ projectId });
        const pushTokenString = pushTokenResponse.data;
        return pushTokenString;

      } catch (e) {
        Toast.show({
          text: `${e}`,
          type: "danger",
        });
      }
    } else {
      Toast.show({
        text: "Must use physical device for Push Notifications",
        type: "danger",
      });
    }

    // Setup notification channel for Android devices
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
  };

  const sendPushNotification = async ( data) => {
    let message = {};
    if(data.status === "cancelled"){
      message = {
        to: "ExponentPushToken[ofS4h6DXUTnJL0KETIWKR3]",
        sound: "default",
        title: "Ride Request Cancelled!",
        body: `Your FRIEND has cancelled the ride! You can now request another ride.`,
        data: { orderData: data },
      };
    }

    else{
      message = {
        to: "ExponentPushToken[ofS4h6DXUTnJL0KETIWKR3]",
        sound: "default",
        title: "Ride Request Accepted!",
        body: `Your FRIEND is on the way!`,
        data: { orderData: data }, 
      };
    }
    
    
    try {
      await axios.post("https://exp.host/--/api/v2/push/send", message);
    } catch (error) {
      console.log("Error sending push notification:", error);
    }
  };



  //websocket updates
  useEffect(() => {
    ws.onopen = () => {
      console.log("Connected to WebSocket server");
      setWsConnected(true);
    };

    ws.onmessage = (e) => {
      const message = JSON.parse(e.data);
      console.log("Received message:", message);
    };

    ws.onerror = (e) => {
      console.log("WebSocket error:", e.message);
    };

    ws.onclose = (e) => {
      console.log("WebSocket closed:", e.code, e.reason);
    };

    return () => {
      ws.close();
    };
  }, []);


  //LOCATION UPDATES **
  const sendLocationUpdate = async (location) => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const res = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_URI}/riders/get-current-rider`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (res.data.data) {
        if (ws.readyState === WebSocket.OPEN) {
          const message = JSON.stringify({
            type: "locationUpdate",
            data: location,
            role: "driver",
            driver: res.data.data._id,
          });
          ws.send(message);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  //send location updates to the server
  useEffect(() => {
    (async () => {
      let { status } = await GeoLocation.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Toast.show("Please give us to access your location to use this app!");
        return;
      }

      await GeoLocation.watchPositionAsync(
        {
          accuracy: GeoLocation.Accuracy.High,
          timeInterval: 10000,
          distanceInterval: 0.5,
        },
        async (position) => {
          const { latitude, longitude } = position.coords;
          const newLocation = { latitude, longitude };
          if (
            !lastLocation ||
            haversineDistance(lastLocation, newLocation) > 200
          ) {
            setCurrentLocation(newLocation);
            setLastLocation(newLocation);
            if (ws.readyState === WebSocket.OPEN) {
              await sendLocationUpdate(newLocation);
            }
          }
        }
      );
    })();
  }, []);

  //location permission and sending location updates
  useEffect(() => {
    (async () => {
      let { status } = await GeoLocation.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Toast.show("Please give us to access your location to use this app!");
        return;
      }

      await GeoLocation.watchPositionAsync(
        {
          accuracy: GeoLocation.Accuracy.High,
          timeInterval: 10000,
          distanceInterval: 1,
        },
        async (position) => {
          const { latitude, longitude } = position.coords;
          const newLocation = { latitude, longitude };
          if (
            !lastLocation ||
            haversineDistance(lastLocation, newLocation) > 200
          ) {
            setCurrentLocation(newLocation);
            setLastLocation(newLocation);
            if (ws.readyState === WebSocket.OPEN) {
              await sendLocationUpdate(newLocation);
            }
          }
        }
      );
    })();
  }, []);


  //ride details banner functionalities **

  const viewRideDetails = () => {
    router.push({
      pathname: "/(routes)/ride-details",
    });
  };

  //get-current-ride
  useEffect(() => {
    const fetchCurentRide = async () => {
      try{
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
          setRideDetails(response.data.data);
          setIsCurrentRide(true);
        }
      }
      catch(error){
        console.error("Error getting current ride:", error);
      }
    }
    fetchCurentRide();
  },[]);
  
  //Accept/Reject Ride Modal functionalities **
  useEffect(() => {
    let timeoutId;
  
    const handleAutoReject = async () => {
      if (!isRideAcceptTriggered && isModalVisible && !isProcessingRide) {
        setIsProcessingRide(true);
        try {
          await cancelRideHandler();
        } finally {
          setIsProcessingRide(false);
        }
      }
    };
  
    if (isModalVisible && !isRideAcceptTriggered && !isProcessingRide) {
      timeoutId = setTimeout(handleAutoReject, 10000);
    }
  
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isModalVisible, isRideAcceptTriggered, isProcessingRide]);

  const acceptRideHandler = async () => {
    if (isProcessingRide || isRideAcceptTriggered) return;
    
    try {
      setIsProcessingRide(true);
      setIsRideAcceptTriggered(true);
      setIsModalVisible(false);
      
      const accessToken = await AsyncStorage.getItem("accessToken");
      const pickup = LOCATIONS.find((location) => location.name === currentLocationName);
      const dropoff = LOCATIONS.find((location) => location.name === destinationLocationName);
      setPickupId(pickup.id);
      setDropoffId(dropoff.id);
      
      const charge = findRate(pickup.id, dropoff.id);
      
      const reqData = {
        userId: userData?._id,
        charge: charge.toFixed(2),
        status: "Processing",
        currentLocationName,
        destinationLocationName,
        distance,
      };
  
      await axios.post(
        `${process.env.EXPO_PUBLIC_SERVER_URI}/riders/create-new-ride`,
        reqData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
      const data = {
        ...driver,
        currentLocation,
        marker,
        distance,
        status: "accepted",
      };
  
      await sendPushNotification(data);
      
      router.push({
        pathname: "/(routes)/ride-details",
      });
      
      console.log("Ride request accepted!");
    } catch (error) {
      console.error("Error accepting ride:", error);
      setIsRideAcceptTriggered(false);
      setIsModalVisible(true);
    } finally {
      setIsProcessingRide(false);
    }
  };

  const cancelRideHandler = async () => {
    if (isProcessingRide || !isModalVisible || isRideAcceptTriggered) return;
    
    try {
      setIsProcessingRide(true);
      setIsModalVisible(false);
      setIsRideAcceptTriggered(true);
      await sendPushNotification({ status: "cancelled" });
    } catch (error) {
      console.error("Error cancelling ride:", error);
      setIsRideAcceptTriggered(false);
      setIsModalVisible(true);
    } finally {
      setIsProcessingRide(false);
    }
  };





  //ON/OFF button functionalities **

  //fetching (active/inactive) status from async storage
  useEffect(() => {
    const fetchStatus = async () => {
      const status = await AsyncStorage.getItem("status");
      
      setIsAcceptingRides(status === "active" ? true : false);
    };
    fetchStatus();
  },[]);

  const toggleAcceptingRides = async () => {
    if (!loading) {
      startRippleAnimation();
      try {
        const accessToken = await AsyncStorage.getItem("accessToken");
        const response = await axios.patch(
          `${process.env.EXPO_PUBLIC_SERVER_URI}/riders/update-rider-status`,
          {
            status: isAcceptingRides ? "inactive" : "active",
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.data.data) {
          setIsAcceptingRides(!isAcceptingRides);
          await AsyncStorage.setItem("status", response.data.data.status);
        }
      } catch (error) {
        console.error("Error changing status:", error);
      } 
    }
  };

  const startRippleAnimation = () => {
    rippleAnimation.setValue(0);
    Animated.sequence([
      Animated.timing(rippleAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ]).start();
  };


  

  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Toast/>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.emoji}>👤</Text>
            <View>
              {/* Displaying Driver's Full Name */}
              <Text style={styles.welcomeText}>
                Welcome back, {driver?.firstName} {driver?.lastName}
              </Text>
              {/* Optionally display phone number */}
              <Text style={styles.subText}>{driver?.phoneNumber}</Text>
            </View>
          </View>
          <Text style={styles.emoji}>⚙️</Text>
        </View>
        

        <RideRequestModal
          isVisible={isModalVisible}
          currentLocationName={currentLocationName}
          destinationLocationName={destinationLocationName}
          distance={distance}
          rideCharge={rideCharge}
          onAccept={acceptRideHandler}
          onCancel={cancelRideHandler}
        />

        

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Text style={styles.emoji}>💰</Text>
              <Text style={styles.statLabel}>Earnings</Text>
            </View>
            <Text style={styles.statValue}>₹{driver?.totalEarning || '0.00'}</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Text style={styles.emoji}>🚗</Text>
              <Text style={styles.statLabel}>Trips</Text>
            </View>
            <Text style={styles.statValue}>{driver?.totalRides || '0'}</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Text style={styles.emoji}>⭐</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <Text style={styles.statValue}>{driver?.ratings || '0'}</Text>
          </View>
        </View>

        <AcceptingRidesButton
          isAcceptingRides={isAcceptingRides}
          toggleAcceptingRides={toggleAcceptingRides}
          rippleAnimation={rippleAnimation}
        />

      </ScrollView>
      {isCurrentRide && (
        <View style={styles.rideBanner}>
          <Text style={styles.bannerText}>Pickup at {rideDetails.currentLocationName}</Text>
          <TouchableOpacity style={styles.bannerButton} onPress={viewRideDetails}>
            <Text style={styles.bannerButtonText}>Ride Details</Text>
          </TouchableOpacity>
      </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    marginTop: 30,
  },
  scrollView: {
    flex: 1,
    paddingBottom:100
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  subText: {
    fontSize: 14,
    color: '#6b7280',
  },
  emoji: {
    fontSize: 24,
  },
  vehicleInfoContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#1f2937',
    marginBottom: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  
  rideBanner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: width,
    padding: 15,
    backgroundColor: '#333',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerText: {
    color: '#fff',
    fontSize: 16,
  },
  bannerButton: {
    backgroundColor: '#34D399',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  bannerButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default HomeScreen;
