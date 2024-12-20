import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { MaterialIcons, FontAwesome6, Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import BillModal from '../../../components/BillModal';
import { getDistance } from 'geolib';
import { useRouter } from 'expo-router';
import * as Notifications from "expo-notifications";
import Toast from '../../../components/Toast';
import MotorcycleCard from '../../../components/MotorcycleLoader.jsx';


const RideTracking = () => {
  const router = useRouter();
  const [billModalVisible, setBillModalVisible] = useState(false);
  const { orderData } = useLocalSearchParams();
  const data = JSON.parse(orderData);
  const ws = useRef(null);
  const notificationListener = useRef(null);
  const [isRideStarted, setIsRiding] = useState(false);
  const [region, setRegion] = useState({
    latitude: 12.90695,
    longitude:77.49916,
    latitudeDelta: 0.009,
    longitudeDelta: 0.009,
  });

  const [driverLocation, setDriverLocation] = useState(data?.driver?.currentLocation);
 const riderData = {
    id: data.driver._id,
    image: 'https://via.placeholder.com/50',
    name: data.driver.firstName+" "+data.driver.lastName,
    vehicleType: data.driver.vehicleManufacturer+", "+data.driver.vehicleModel,
    vehicleNumber: data.driver.vehicleNumber,
    rating: data.driver.ratings,
    distance: data.driver.distance,
    pickupLocationName: data.pickupLocation.name,
    pickupLocation: data.pickupLocation,
    dropoffLocationName: data.dropoffLocation.name,
    rideCharge: data.rideCharge,
  };

  const onBackPress = () => {
    router.back();
  };
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  const initializeWebSocket = () => {
    ws.current = new WebSocket(`ws://${process.env.EXPO_PUBLIC_HOST_IP}:${process.env.EXPO_PUBLIC_SOCKET_PORT}`);

    ws.current.onopen = () => {
      console.log("Connected to websocket server on ride tracking screen");
    };

    ws.current.onmessage =  (e) => {
      try {
        const message = JSON.parse(e.data);
        if (message.type === "driverLiveLocationWithId" && message.location) {
          setDriverLocation(message.location);
          const distance = getDistance(
            { latitude: region.latitude, longitude: region.longitude },
            { latitude: message.location.latitude, longitude: message.location.longitude }
          );

          if (distance > 5) {
            setRegion((prevRegion) => ({
              ...prevRegion,
              latitude: message.location.latitude,
              longitude: message.location.longitude,
            }));
          }
        }
      } catch (e) {
        console.error("Error parsing message: ", e);
      }
    }

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error.message);
    };

    ws.current.onclose = () => {
      console.log("WebSocket closed. Reconnecting...");
      setTimeout(() => initializeWebSocket(), 5000);
    };
  };

  // WebSocket and Notification Listeners within useFocusEffect
  useFocusEffect(
    useCallback(() => {
      initializeWebSocket();
      
      notificationListener.current =
        Notifications.addNotificationReceivedListener((notification) => {
          console.log("Notification received: ", notification.request.content.data.orderData);
          if(notification.request.content.data.orderData === "started") {
            setIsRiding(true);
            Toast.show("Ride has started, meanwhile you can play the game");
          } else if(notification.request.content.data.orderData === "ended") {
            Toast.show("Thank you for riding with us, ride has been completed");
            router.push(`/(routes)/payments?name=${riderData.name}&charge=${riderData.rideCharge}`);
          }
        });

      return () => {
        if (ws.current) ws.current.close();
        Notifications.removeNotificationSubscription(notificationListener.current);
      };
    }, []) 
  );

  const requestRiderLocation = () => {
    ws.current.send(
      JSON.stringify({
        type: "getDriverLocation",
        role: "user",
        driverId: data.driver._id,
      })
    );
  }

  useFocusEffect(
    useCallback(() => {
      const intervalId = setInterval(requestRiderLocation, 10000);
      return () => clearInterval(intervalId);
    }, [])
  );
  


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Toast/>
        <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
                <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.riderInfo}>
        {isRideStarted ? (
          <View style={styles.motorCycleContainer}>
            <MotorcycleCard />
          </View>
        ):(
          <MapView 
              style={styles.mapContainer}
              region={region} 
              onRegionChangeComplete={(region) => setRegion(region)}
            >
                {driverLocation && (
                  <Marker coordinate={driverLocation} title="Driver" >
                    <MaterialIcons name="motorcycle" size={24} color="black" />
                  </Marker>
                )}
                <Marker coordinate={data.driver.currentLocation} title="Pickup" >
                  <FontAwesome6 name="map-pin" size={24} color="black" />
                </Marker>
                {data?.driver?.marker && (
                  <MapViewDirections
                    origin={driverLocation}
                    destination={data.driver.currentLocation}
                    apikey={process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY}
                    strokeWidth={3}
                    strokeColor="blue"
                  />
                )}
            </MapView>
        )}
        
        <View style={styles.bottomInfo}>
          <View style={styles.riderHeader}>
            <View style={styles.riderProfile}>
              <Image 
                source={{ uri: riderData.image }} 
                style={styles.riderImage} 
              />
              <View style={styles.driverBadge}>
                <MaterialIcons name="motorcycle" size={14} color="black" />
              </View>
            </View>
            <View style={styles.riderDetails}>
              <Text style={styles.riderName} numberOfLines={1}>{riderData.name}</Text>
              <Text style={styles.vehicleType} numberOfLines={1}>{riderData.vehicleType}</Text>
              <Text style={styles.vehicleType} numberOfLines={1}>{riderData.vehicleNumber}</Text>
            </View>
            <View style={styles.ratingContainer}>
              <View style={styles.ratingRow}>
                <MaterialIcons name="star" size={16} color="#FFD700" />
                <Text style={styles.ratingText}>{riderData.rating}</Text>
              </View>
            </View>
          </View>

          <View style={styles.locationInfo}>
            <View style={styles.locationItem}>
              <MaterialIcons name="location-on" size={24} color="#FFA500" />
              <Text style={styles.locationText} numberOfLines={2}>{riderData.pickupLocationName}</Text>
            </View>
            <View style={styles.locationDivider} />
            <View style={styles.locationItem}>
              <MaterialIcons name="location-on" size={24} color="#4169E1" />
              <Text style={styles.locationText} numberOfLines={2}>{riderData.dropoffLocationName}</Text>
            </View>
          </View>

          <View style={styles.priceContainer}>
            <View style={styles.priceRow}>
              <Text style={styles.priceText}>₹{riderData.rideCharge}</Text>
              <Text style={styles.timeEstimate}>{riderData.distance} km</Text>
            </View>
            <TouchableOpacity 
              style={styles.viewBillButton}
              onPress={() => setBillModalVisible(true)}
            >
              <MaterialIcons name="receipt-long" size={24} color="white" />
            </TouchableOpacity>
          </View>

        {!isRideStarted && (
          <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.cancelButton}>
            <MaterialIcons name="close" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.callButton}>
            <MaterialIcons name="phone" size={24} color="white" />
          </TouchableOpacity>
        </View>
        )}
          
          </View>
        </View>
      </ScrollView>

      <BillModal 
        visible={billModalVisible}
        onClose={() => setBillModalVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    paddingTop: 40,
  },
  scrollContainer: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
    backgroundColor: '#333',
    padding: 8,
    borderRadius: 20,
},
  motorCycleContainer:{
    flex: 1,
    marginBottom: 20,
    overflow: 'hidden', 
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    position: 'relative',
  },
  mapContainer: {
    flex: 1,
    height: 250,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB', 
    borderStyle: 'solid',
    overflow: 'hidden', 
    backgroundColor: '#666', 
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    position: 'relative',
    zIndex: 1,
  },
  bottomInfo: {
    padding: 16,
  },
  riderInfo: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  riderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  riderProfile: {
    position: 'relative',
    width: 50,
    height: 50,
  },
  riderImage: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
  },
  driverBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#FFD700',
    borderRadius: 12,
    padding: 4,
    elevation: 2,
    
  },
  riderDetails: {
    flex: 1,
    marginLeft: 15,
    marginRight: 10,
  },
  riderName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  vehicleType: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  ratingContainer: {
    alignItems: 'flex-end',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
    color: '#000',
  },
  timeText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  locationInfo: {
    marginVertical: 20,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  locationDivider: {
    height: 20,
    width: 1,
    backgroundColor: '#E0E0E0',
    marginLeft: 12,
  },
  locationText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  priceContainer: {
    marginBottom: 20,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  priceText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
  },
  viewBillButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 25,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    
  },
  viewBillText: {
    color: '#333',
    fontWeight: '600',
  },
  timeEstimate: {
    fontSize: 14,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: '#FF0000',
    borderRadius: 25,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    
  },
  callButton: {
    backgroundColor: '#FFA500',
    borderRadius: 25,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    
  },
  
});

export default RideTracking;