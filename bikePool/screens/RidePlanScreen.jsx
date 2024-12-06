import React, { useState, useEffect, useRef } from 'react';

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Image,
    ScrollView,
    Modal,
    Platform,
    Dimensions,
    ImageBackground,
    ActivityIndicator,
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import RideConfirmationModal from '../components/RideConfirmationModal';
import Toast from '../components/Toast';
import { LinearGradient } from 'expo-linear-gradient';
import * as Notifications from "expo-notifications";
import { useRouter } from 'expo-router';
import { LOCATIONS, RATE_CHART } from '../constants/constants.js';
import axios from 'axios';
import useGetUserData from '../hooks/useGetUserData.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Wallpaper from '../assets/images/ridePlanWallpaper.jpg'
import RadarScanner from '../components/FindingRiders.jsx';
const { width } = Dimensions.get('window');

const RidePlanScreen = () => {
    const { loading, user } = useGetUserData();
    const ws = useRef(null);
    const notificationListener = useRef(null);
    const [wsConnected, setWsConnected] = useState(false);
    const [marker, setMarker] = useState({
        latitude: LOCATIONS[5].lat,
        longitude: LOCATIONS[5].lng,
    });
    const [currentLocation, setCurrentLocation] = useState({
        latitude: LOCATIONS[2].lat,
        longitude: LOCATIONS[2].lng,
    });
    const [distance, setDistance] = useState(null);
    const [locationSelected, setLocationSelected] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    
    const [driverLists, setDriverLists] = useState([]);
    const [driverLoader, setDriverLoader] = useState(false);

    const [pickup, setPickup] = useState(LOCATIONS[2]); // Default: BGS Arc
    const [dropoff, setDropoff] = useState(LOCATIONS[5]); // Default: Ganesha Circle
    const [rideCharge, setRideCharge ] = useState(10);
    const [showLocations, setShowLocations] = useState(false);
    const [isPickup, setIsPickup] = useState(true);
    const [showRiders, setShowRiders] = useState(false);
    const [selectedRider, setSelectedRider] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [animationCount, setAnimationCount] = useState(0);
    const [isCurrentRide, setIsCurrentRide] = useState(false);
    const [rideDetails, setRideDetails] = useState(null);
    const [isDriverLoading, setIsDriverLoading] = useState(false);
    const [region, setRegion] = useState({
        latitude: 12.906954343,
        longitude: 77.499163806,
        latitudeDelta: 0.018,
        longitudeDelta: 0.02,
      });
      
    const router = useRouter();

    const findRate = (pickupId, dropId) => {
        const rateInfo = RATE_CHART.find(
            (rate) => rate.pickupId === pickupId && rate.dropId === dropId
        );
        return rateInfo ? rateInfo.rate : null;
    };
    
    const handleLocationSelect = (location) => {
        if (isPickup) {
            setPickup(location);
            setRideCharge(findRate(location.id, dropoff.id));
            setCurrentLocation({ latitude: location.lat, longitude: location.lng });
        } else {
            setDropoff(location);
            setRideCharge(findRate(pickup.id, location.id));
            setMarker({ latitude: location.lat, longitude: location.lng });
        }
        setShowLocations(false);
    };

    const handleRiderSelect = (rider) => {
        setSelectedRider(rider);
    };

    const handleAnimationComplete = () => {
        if (animationCount < 2) {
            setAnimationCount((prev) => prev + 1);
        } else {
            setAnimationCount(0);
        }
    };

    const saveOrderData = async () => {
        try {
            await AsyncStorage.setItem('orderData', JSON.stringify(orderDataRef.current));
        } catch (e) {
            console.error("Error saving order data:", e);
        }
    };

    const loadOrderData = async () => {
        try {
            const savedOrderData = await AsyncStorage.getItem('orderData');
            if (savedOrderData) {
                orderDataRef.current = JSON.parse(savedOrderData);
            }
        } catch (e) {
            console.error("Error loading order data:", e);
        }
    };

    const orderDataRef = useRef({
        driver: null,
        pickupLocation: pickup,
        dropoffLocation: dropoff,
        rideCharge: rideCharge,
    });

    useEffect(() => {
        orderDataRef.current = {
            driver: null, 
            pickupLocation: pickup,
            dropoffLocation: dropoff,
            rideCharge: rideCharge,
        };
    }, [pickup, dropoff, rideCharge]);
    

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
            if(notification.request.content.data.orderData.status === "accepted"){
            orderDataRef.current.driver = notification.request.content.data.orderData;
            saveOrderData();
            setShowConfirmation(false);
            router.push({
            pathname: "/(routes)/ride-details",
            params: { orderData: JSON.stringify(orderDataRef.current) },
            });
            }
            else if(notification.request.content.data.orderData.status === "cancelled"){
                setShowConfirmation(false);
                Toast.show("Ride request rejected by driver");
            }
        });

        return () => {
        Notifications.removeNotificationSubscription(
            notificationListener.current
        );
        };
    }, []);

    //location permission
    useEffect(() => {
        (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            Toast.show(
            "Please approve your location tracking otherwise you can't use this app!",
            {
                type: "danger",
                placement: "bottom",
            }
            );
        }

        let location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
        });
        const { latitude, longitude } = location.coords;
        setCurrentLocation({ latitude, longitude });
        setRegion({
            latitude,
            longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        });
        })();
    }, []);


    //initialize websocket
    const initializeWebSocket = () => {
        ws.current = new WebSocket(`ws://${process.env.EXPO_PUBLIC_HOST_IP}:${process.env.EXPO_PUBLIC_SOCKET_PORT}`);
        ws.current.onopen = () => {
        console.log("Connected to websocket server");
        setWsConnected(true);
        };

        ws.current.onerror = (e) => {
        console.log("WebSocket error:", e.message);
        };

        ws.current.onclose = (e) => {
        console.log("WebSocket closed:", e.code, e.reason);
        setWsConnected(false);
        setTimeout(() => {
            initializeWebSocket();
        }, 5000);
        };
    };

    //calling websocket
    useEffect(() => {
        initializeWebSocket();
        return () => {
        if (ws.current) {
            ws.current.close();
        }
        };
    }, []);


    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        var p = 0.017453292519943295;
        var c = Math.cos;
        var a =
          0.5 -
          c((lat2 - lat1) * p) / 2 +
          (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2;
    
        return 12742 * Math.asin(Math.sqrt(a));
      };

    useEffect(() => {
        if (marker && currentLocation) {
        const dist = calculateDistance(
            currentLocation.latitude,
            currentLocation.longitude,
            marker.latitude,
            marker.longitude
        );
        setDistance(dist);
        }
    }, [marker, currentLocation]);

    
    const getDriversData = async (drivers) => {
        if (!drivers || drivers.length === 0) {
            setDriverLists([]);
            setShowRiders(true);
            setDriverLoader(false);
            return;
        }

        try{
            const driverIds = drivers.map((driver) => driver.id).join(",");
            console.log("Driver ids:", driverIds);
            const response = await axios.post(
            `${process.env.EXPO_PUBLIC_SERVER_URI}/riders/get-riders-by-id`,
            {
                ids: driverIds ,
            }
            );

            const driverData = response.data;
            setDriverLists(driverData.data);
            setShowRiders(true);
            setDriverLoader(false);
        }
        catch(error){
            console.error("Error fetching drivers data:", error);
            Toast.show("Error fetching drivers data");
            setDriverLists([]);
        }
    };

    const getNearbyDrivers = () => {
        ws.current.onmessage = async (e) => {
            try {
                const message = JSON.parse(e.data);
                if (message.type === "nearbyDrivers") {
                    const validDrivers = message.drivers.filter((driver) => {
                        return driver.id && driver.id !== "undefined" && driver.id !== "[object Object]";
                    });
                    await getDriversData(validDrivers);
                }
            } catch (error) {
                console.log("Error parsing websocket :", error);
            }
        };
    };

    const requestNearbyDrivers = () => {
        if (currentLocation && wsConnected) {
        ws.current.send(
            JSON.stringify({
            type: "requestRide",
            role: "user",
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            })
        );
        setIsDriverLoading(true);
        setShowRiders(true);
        setTimeout(() => {
            getNearbyDrivers();
            setIsDriverLoading(false);
        }, 10000);
        }
    };

    const sendPushNotification = async (expoPushToken, data) => {
        const message = {
        to: expoPushToken,
        sound: "default",
        title: "New Ride Request",
        body: "You have a new ride request.",
        data: { orderData: data },
        };

        try {
            await axios.post("https://exp.host/--/api/v2/push/send", message);
        } catch (error) {
            console.error("Error sending notification:", error);
        }
    };

    
    const handleConfirmBooking = async () => {
        const data = {
            user,
            currentLocation,
            marker,
            distance: distance.toFixed(2),
            currentLocationName:pickup.name,
            destinationLocationName:dropoff.name,
            rideCharge,
            userNotificationToken: user.notificationToken,
            };
            await sendPushNotification(selectedRider.notificationToken, JSON.stringify(data));
         
        setShowConfirmation(true);
        setShowRiders(false);

    };

    //get-current-ride
    useEffect(() => {
        const fetchCurentRide = async () => {
        try{
            const accessToken = await AsyncStorage.getItem("accessToken");
            const response = await axios.get(
            `${process.env.EXPO_PUBLIC_SERVER_URI}/users/get-current-ride`,
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

    const viewRideDetails = async () => {
        await loadOrderData();
        router.push({
            pathname: "/(routes)/ride-details",
            params: { orderData: JSON.stringify(orderDataRef.current) },
        });
    };

    return (
        <ImageBackground source={Wallpaper} 
        style={styles.backgroundImage}>
        <SafeAreaView style={styles.container}  >
            <Toast/>
            {/* Location Selection */}
            <View style={styles.locationContainer}>
                <TouchableOpacity 
                    style={styles.locationItem}
                    onPress={() => {
                        setIsPickup(true);
                        setShowLocations(true);
                    }}
                >
                    <MaterialIcons name="my-location" size={24} color="#2196F3" />
                    <View style={styles.locationTextContainer}>
                        <Text style={styles.locationLabel}>Pick up location</Text>
                        <Text style={styles.locationText}>{pickup.name}</Text>
                    </View>
                </TouchableOpacity>

                <View style={styles.divider} />

                <TouchableOpacity 
                    style={styles.locationItem}
                    onPress={() => {
                        setIsPickup(false);
                        setShowLocations(true);
                    }}
                >
                    <MaterialIcons name="location-on" size={24} color="#2196F3" />
                    <View style={styles.locationTextContainer}>
                        <Text style={styles.locationLabel}>Drop off location</Text>
                        <Text style={styles.locationText}>{dropoff.name}</Text>
                    </View>
                </TouchableOpacity>
            </View>

            {!isCurrentRide && (
                <View style={styles.rideOptionsContainer}>
                    <TouchableOpacity
                        style={[
                            styles.findRideButton, 
                            !rideCharge && styles.disabledButton 
                        ]}
                        onPress={requestNearbyDrivers}
                        disabled={!rideCharge} 
                    >
                        {rideCharge ? (
                            <Text style={styles.findRideText}>Find Ride at Rs.{rideCharge}</Text>
                        ) : (
                            <Text style={styles.unserviceableText}>Route Unserviceable</Text>
                        )}
                    </TouchableOpacity>
                </View>
            )}
            <TouchableOpacity
                style={styles.findRideButton}
                onPress={() => router.push({ pathname: "/(routes)/payments" })}
            >
                <Text style={styles.findRideText}>Proxy to payments</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.findRideButton}
                onPress={() => router.push({ pathname: "/(routes)/rating" })}
            >
                <Text style={styles.findRideText}>Proxy to Rating</Text>
            </TouchableOpacity>
            {/* Location Selection Modal */}
            <Modal
                visible={showLocations}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowLocations(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                Select {isPickup ? 'Pickup' : 'Drop-off'} Location
                            </Text>
                            <TouchableOpacity 
                                style={styles.closeButton}
                                onPress={() => setShowLocations(false)}
                            >
                                <MaterialIcons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>
                        {(LOCATIONS).map((location) => (
                            <TouchableOpacity
                                key={location.id}
                                style={styles.locationOption}
                                onPress={() => handleLocationSelect(location)}
                            >
                                <MaterialIcons 
                                    name={isPickup ? "my-location" : "location-on"}
                                    size={24}
                                    color="#2196F3"
                                />
                                <View style={styles.locationOptionText}>
                                    <Text style={styles.locationOptionName}>{location.name}</Text>
                                    <Text style={styles.locationOptionAddress}>{location.address}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </Modal>

            {/* Riders Modal */}
            <Modal
                visible={showRiders}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowRiders(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Available Riders Nearby</Text>
                            <TouchableOpacity 
                                style={styles.closeButton}
                                onPress={() => setShowRiders(false)}
                            >
                                <MaterialIcons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>
                        
                        {
                            isDriverLoading ? (
                                <RadarScanner />
                            ) : driverLists.length === 0 ? (
                                <Text style={styles.confirmButtonText}>OOPs! No riders available</Text>
                            ) : (
                                <>
                                    {driverLists.map((rider) => (
                                        <TouchableOpacity
                                            key={rider._id}
                                            style={[
                                                styles.riderOption,
                                                selectedRider?._id === rider._id && styles.selectedRiderOption
                                            ]}
                                            onPress={() => handleRiderSelect(rider)}
                                        >
                                            <Image source={{ uri: 'https://via.placeholder.com/50' }} style={styles.riderImage} />
                                            <View style={styles.riderInfo}>
                                                <Text style={styles.riderName}>{rider.firstName} {rider.lastName}</Text>
                                                <Text style={styles.vehicleNumber}>{rider.vehicleNumber}</Text>
                                                <Text style={styles.vehicleNumber}>{rider.vehicleManufacturer}, {rider.vehicleModel}</Text>
                                                <View style={styles.riderDetails}>
                                                    <View style={styles.ratingContainer}>
                                                        <MaterialIcons name="star" size={16} color="#FFD700" />
                                                        <Text style={styles.ratingText}>
                                                            {rider.ratings} ({rider.totalRides} rides)
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <MaterialCommunityIcons 
                                                name={'motorbike'} 
                                                size={24} 
                                                color="#666" 
                                            />
                                        </TouchableOpacity>
                                    ))}

                                    {selectedRider && (
                                        <TouchableOpacity 
                                            style={styles.confirmButton}
                                            onPress={handleConfirmBooking}
                                        >
                                            <Text style={styles.confirmButtonText}>CONFIRM BOOKING</Text>
                                        </TouchableOpacity>
                                    )}
                                </>
                            )
                        }  
                    </View>
                </View>
            </Modal>

            <RideConfirmationModal
                visible={showConfirmation}
                onAnimationComplete={handleAnimationComplete}
            />
            {isCurrentRide && (
                <LinearGradient
                colors={['#222222', '#111111']}
                style={styles.rideBanner}
              >
                <Text style={styles.bannerText}>Pickup at {rideDetails.currentLocationName}</Text>
                <TouchableOpacity 
                  style={styles.bannerButton} 
                  onPress={viewRideDetails}
                >
                  <LinearGradient
                    colors={['#4F46E5', '#4338CA']}
                    style={styles.bannerButtonGradient}
                  >
                    <Text style={styles.bannerButtonText}>View Details</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </LinearGradient>
            )}
        </SafeAreaView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop:60
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center', 
    },
    user: {
        marginTop:50,
        padding: 20,
    },
    greeting: {
        fontSize: 30,
        fontWeight: '600',
        color: '#fff',
    },
    locationContainer: {
      backgroundColor: 'rgba(0, 0, 0,0.5)',
      margin: 10,
      borderRadius: 15,
      padding: 10,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    locationItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 2,
    },
    locationTextContainer: {
      flex: 1,
      marginLeft: 15,
    },
    locationLabel: {
      fontSize: 12,
      color: '#ccc',
    },
    locationText: {
      fontSize: 16,
      color: '#fff',
      marginTop: 2,
    },
    divider: {
      height: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      marginVertical: 5,
    },
    mapContainer: {
      flex: 1,
      margin: 15,
      borderRadius: 15,
      overflow: 'hidden',
      backgroundColor: '#121212',
    },
    mapPlaceholder: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    mapPlaceholderText: {
      marginTop: 5,
      color: '#ccc',
    },
    rideOptionsContainer: {
      padding: 20,
      alignItems: 'center',
    },
    findRideButton: {
      backgroundColor: '#2196F3',
      padding: 15,
      borderRadius: 8,
      alignItems: 'center',
      width: '80%',
    },
    disabledButton: {
      backgroundColor: '#C62828',
    },
    findRideText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    unserviceableText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
      backgroundColor: '#1E1E1E',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      maxHeight: '80%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#fff',
    },
    closeButton: {
      padding: 5,
    },
    locationOption: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    locationOptionText: {
      marginLeft: 15,
    },
    locationOptionName: {
      fontSize: 16,
      fontWeight: '500',
      color: '#fff',
    },
    locationOptionAddress: {
      fontSize: 14,
      color: '#ccc',
      marginTop: 2,
    },
    riderOption: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    selectedRiderOption: {
      backgroundColor: '#333',
      borderRadius: 10,
    },
    riderImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 15,
    },
    riderInfo: {
      flex: 1,
    },
    riderName: {
      fontSize: 16,
      fontWeight: '600',
      color: '#fff',
    },
    vehicleNumber: {
      fontSize: 14,
      color: '#ccc',
    },
    riderDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 5,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    ratingText: {
      marginLeft: 5,
      fontSize: 14,
      color: '#ccc',
    },
    distanceText: {
      fontSize: 14,
      color: '#ccc',
    },
    confirmButton: {
      backgroundColor: '#333',
      padding: 15,
      borderRadius: 10,
      marginTop: 20,
      alignItems: 'center',
    },
    confirmButtonText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 16,
    },
    confirmButtonTouchable: {
      width: '100%',
      alignItems: 'center',
    },
    trackButton: {
      backgroundColor: '#4CAF50',
      padding: 15,
      borderRadius: 10,
      marginTop: 10,
      alignItems: 'center',
    },
    trackButtonText: {
      color: '#fff',
      fontWeight: '600',
    },
    rideBanner: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: width,
        paddingHorizontal: 16,
        paddingVertical: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 90,
        borderRadius: 30,
      },
      bannerText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
      },
      bannerButton: {
        borderRadius: 30,
        overflow: 'hidden',
      },
      bannerButtonGradient: {
        paddingVertical: 8,
        paddingHorizontal: 16,
      },
      bannerButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
      },
  });

export default RidePlanScreen;
