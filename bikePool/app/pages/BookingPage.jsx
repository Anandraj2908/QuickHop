import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Image,
    ScrollView,
    Modal,
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import RideConfirmationModal from '../../components/RideConfirmationModal';

import { useRouter } from 'expo-router';
import MapViewComponent from '../../components/MapView';

const PICKUP_LOCATIONS = [
    { id: 1, name: 'Global Bus Stand', address: 'Main Entrance', lat:12.91242931983958, lng: 77.50058707234462 },
    { id: 2, name: 'Global Back Gate', address: 'Rear Exit', lat:12.916770639697011, lng: 77.500277639682 },
    { id: 3, name: 'BGS Arc', address: 'Main Building', lat:12.906954343616608, lng: 77.49916380605536 },
    { id: 4, name: 'Kengeri Crossing', address: 'Junction Point', lat:12.912429604565734, lng:77.48552065017432 },
];

const DROP_LOCATIONS = [
    { id: 1, name: 'BGS Hospital', address: 'Medical Center', lat:12.902666463247161, lng:77.49822618206055 },
    { id: 2, name: 'Ganesha Circle', address: 'Main Junction', lat:12.898329097309421, lng:77.4964293637215 },
];

const AVAILABLE_RIDES = [
    {
        id: 1,
        type: 'Regular Bike',
        price: 45.00,
        eta: '3 mins',
        icon: 'motorbike'
    },
    {
        id: 2,
        type: 'Electric Bike',
        price: 50.00,
        eta: '5 mins',
        icon: 'motorbike-electric'
    }
];

const SAMPLE_RIDERS = [
    {
        id: 1,
        name: 'Rahul Kumar',
        vehicleNumber: 'KA 01 AB 1234',
        rating: 4.8,
        image: 'https://via.placeholder.com/50',
        rides: 1250,
        bikeType: 'Regular Bike',
        distance: '0.8 km away'
    },
    {
        id: 2,
        name: 'Priya Singh',
        vehicleNumber: 'KA 02 CD 5678',
        rating: 4.9,
        image: 'https://via.placeholder.com/50',
        rides: 890,
        bikeType: 'Electric Bike',
        distance: '1.2 km away'
    },
    {
        id: 3,
        name: 'Amit Patel',
        vehicleNumber: 'KA 03 EF 9012',
        rating: 4.7,
        image: 'https://via.placeholder.com/50',
        rides: 720,
        bikeType: 'Regular Bike',
        distance: '1.5 km away'
    }
];

const BookingPage = () => {
    const [pickup, setPickup] = useState(PICKUP_LOCATIONS[2]); // Default: BGS Arc
    const [dropoff, setDropoff] = useState(DROP_LOCATIONS[1]); // Default: Ganesha Circle
    const [selectedRide, setSelectedRide] = useState(null);
    const [showLocations, setShowLocations] = useState(false);
    const [isPickup, setIsPickup] = useState(true);
    const [showRiders, setShowRiders] = useState(false);
    const [selectedRider, setSelectedRider] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const router = useRouter();

    const handleLocationSelect = (location) => {
        if (isPickup) {
            setPickup(location);
        } else {
            setDropoff(location);
        }
        setShowLocations(false);
    };

    const handleRideSelect = (ride) => {
        setSelectedRide(ride);
        setShowRiders(true);
    };

    const handleRiderSelect = (rider) => {
        setSelectedRider(rider);
    };

    const handleAnimationComplete = () => {
        setShowConfirmation(false);
        router.push({
            pathname: '/pages/RideTracking',
            params: {
              rider: selectedRider,
              pickup: pickup,
              dropoff: dropoff,
            },
          });
      };

    const handleConfirmBooking = () => {
        // Implement booking logic here
        
        setShowConfirmation(true);
        setShowRiders(false);
        console.log('Booking confirmed:', {
            pickup,
            dropoff,
            selectedRide,
            selectedRider
        });

    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton}>
                <MaterialIcons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>

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

            {/* Map View */}
            <View style={styles.mapContainer}>
                <Text style={styles.mapPlaceholderText}>Map will be displayed here</Text>
            </View>

            {/* Ride Options */}
            <View style={styles.rideOptionsContainer}>
                <Text style={styles.rideOptionsTitle}>Choose your ride</Text>
                <ScrollView>
                    {AVAILABLE_RIDES.map((ride) => (
                        <TouchableOpacity
                            key={ride.id}
                            style={[
                                styles.rideOption,
                                selectedRide?.id === ride.id && styles.selectedRideOption
                            ]}
                            onPress={() => handleRideSelect(ride)}
                        >
                            <MaterialCommunityIcons 
                                name={ride.icon} 
                                size={32} 
                                color={selectedRide?.id === ride.id ? "#2196F3" : "#666"} 
                            />
                            <View style={styles.rideInfo}>
                                <Text style={styles.rideType}>{ride.type}</Text>
                                <Text style={styles.rideEta}>{ride.eta} away</Text>
                            </View>
                            <Text style={styles.ridePrice}>₹{ride.price}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

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
                        {(isPickup ? PICKUP_LOCATIONS : DROP_LOCATIONS).map((location) => (
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
                        {SAMPLE_RIDERS.map((rider) => (
                            <TouchableOpacity
                                key={rider.id}
                                style={[
                                    styles.riderOption,
                                    selectedRider?.id === rider.id && styles.selectedRiderOption
                                ]}
                                onPress={() => handleRiderSelect(rider)}
                            >
                                <Image source={{ uri: rider.image }} style={styles.riderImage} />
                                <View style={styles.riderInfo}>
                                    <Text style={styles.riderName}>{rider.name}</Text>
                                    <Text style={styles.vehicleNumber}>{rider.vehicleNumber}</Text>
                                    <View style={styles.riderDetails}>
                                        <View style={styles.ratingContainer}>
                                            <MaterialIcons name="star" size={16} color="#FFD700" />
                                            <Text style={styles.ratingText}>
                                                {rider.rating} ({rider.rides} rides)
                                            </Text>
                                        </View>
                                        <Text style={styles.distanceText}>{rider.distance}</Text>
                                    </View>
                                </View>
                                <MaterialCommunityIcons 
                                    name={rider.bikeType === 'Electric Bike' ? 'motorbike-electric' : 'motorbike'} 
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
                    </View>
                </View>
            </Modal>
            <RideConfirmationModal
                visible={showConfirmation}
                onAnimationComplete={handleAnimationComplete}
            />
            
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    backButton: {
        padding: 15,
    },
    locationContainer: {
        backgroundColor: 'white',
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
        color: '#999',
    },
    locationText: {
        fontSize: 16,
        color: '#333',
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: '#EEE',
        marginVertical: 5,
    },
    mapContainer: {
        flex: 1,
        margin: 15,
        borderRadius: 15,
        overflow: 'hidden',
        backgroundColor: '#E1E1E1',
    },
    mapPlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mapPlaceholderText: {
        marginTop: 5,
        color: '#666',
    },
    rideOptionsContainer: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: '40%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    rideOptionsTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 15,
    },
    rideOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        backgroundColor: '#F8F8F8',
    },
    selectedRideOption: {
        backgroundColor: '#E3F2FD',
    },
    rideInfo: {
        flex: 1,
        marginLeft: 15,
    },
    rideType: {
        fontSize: 16,
        fontWeight: '600',
    },
    rideEta: {
        fontSize: 14,
        color: '#666',
    },
    ridePrice: {
        fontSize: 16,
        fontWeight: '600',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
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
    },
    closeButton: {
        padding: 5,
    },
    locationOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    locationOptionText: {
        marginLeft: 15,
    },
    locationOptionName: {
        fontSize: 16,
        fontWeight: '500',
    },
    locationOptionAddress: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    riderOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    selectedRiderOption: {
        backgroundColor: '#e0e8e8',
        borderRadius: 10,
    },
    riderImage: {
        width: 50,
        height: 50,
        borderRadius:        25,
        marginRight: 15,
    },
    riderInfo: {
        flex: 1,
    },
    riderName: {
        fontSize: 16,
        fontWeight: '600',
    },
    vehicleNumber: {
        fontSize: 14,
        color: '#666',
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
        color: '#666',
    },
    distanceText: {
        fontSize: 14,
        color: '#666',
    },
    confirmButton: {
        backgroundColor: '#e0e0e0',
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
        alignItems: 'center',
    },
    confirmButtonText: {
        color: 'black',
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
        color: 'white',
        fontWeight: '600',
    },
});

export default BookingPage;
