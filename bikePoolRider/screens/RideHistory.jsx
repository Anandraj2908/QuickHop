// RideHistoryScreen.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  Alert
} from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Separate component for location details
const LocationDetail = ({ title, location }) => (
  <View style={styles.locationContainer}>
    <View style={styles.locationHeader}>
      <MaterialIcons 
        name={title === 'From' ? 'trip-origin' : 'location-on'} 
        size={20} 
        color="#4b5563"
      />
      <Text style={styles.locationTitle}>{title}</Text>
    </View>
    <Text style={styles.locationText} numberOfLines={1}>
      {location}
    </Text>
  </View>
);

// Separate component for ride status badge
const StatusBadge = ({ status }) => {
  const getStatusColor = () => {
    switch (status.toLowerCase()) {
      case 'completed': return '#10b981';
      case 'cancelled': return '#ef4444';
      case 'ongoing': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  return (
    <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
      <Text style={styles.statusText}>{status}</Text>
    </View>
  );
};

// Separate component for ride card
const RideCard = ({ ride }) => {
  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return {
      date: date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit'
      })
    };
  };

  const { date, time } = formatDateTime(ride.createdAt);

  return (
    <View style={styles.rideCard}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.dateText}>{date}</Text>
          <Text style={styles.timeText}>{time}</Text>
        </View>
        <StatusBadge status={ride.status} />
      </View>

      <View style={styles.divider} />

      <LocationDetail 
        title="From" 
        location={ride.currentLocationName} 
      />
      <LocationDetail 
        title="To" 
        location={ride.destinationLocationName} 
      />

      <View style={styles.rideDetails}>
        <View style={styles.detailItem}>
          <FontAwesome name="motorcycle" size={16} color="#6b7280" />
          <Text style={styles.detailText}>
            {ride.distance} km
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailText}>
          ₹{ride.charge}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <MaterialIcons name="star" size={16} color="#6b7280" />
          <Text style={styles.detailText}>
            {ride.rating ? `${ride.rating}/5.0` : 'Not Rated'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const RideHistory = () => {
  const [rideData, setRideData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchRideHistory = async (showLoader = true) => {
    if (showLoader) setIsLoading(true);
    setError(null);
    
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (!accessToken) throw new Error('Authentication required');

      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_SERVER_URI}/riders/get-all-rides`,
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );
      const sortedRides = response.data.data.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setRideData(sortedRides);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      Alert.alert('Error', 'Failed to load ride history. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRideHistory();
  }, []);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchRideHistory(false);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <MaterialIcons name="error-outline" size={48} color="#ef4444" />
        <Text style={styles.errorText}>Something went wrong</Text>
        <Text style={styles.errorSubText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Ride History</Text>
      <FlatList
        data={rideData}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <RideCard ride={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={['#10b981']}
          />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="motorcycle" size={48} color="#9ca3af" />
            <Text style={styles.emptyText}>No rides yet</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9fafb',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
    marginTop: 8,
  },
  listContent: {
    paddingBottom: 20,
  },
  rideCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  timeText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 12,
  },
  locationContainer: {
    marginBottom: 12,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b5563',
    marginLeft: 8,
  },
  locationText: {
    fontSize: 16,
    color: '#111827',
    paddingLeft: 28,
  },
  rideDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#4b5563',
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 12,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
  },
  errorSubText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default RideHistory;