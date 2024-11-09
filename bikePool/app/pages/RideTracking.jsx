import React, { useState } from 'react';
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
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import BillModal from '../../components/BillModal';


const RideTracking = () => {
  const [billModalVisible, setBillModalVisible] = useState(false);
  const { orderData } = useLocalSearchParams();
  console.log("Order Data: ",orderData);
  

  const riderData = {
    image: 'https://via.placeholder.com/50',
    name: 'Anand Raj',
    vehicleType: 'Hero, Mestro Edge',
    rating: 4.5
  };

  const pickupData = {
    name: 'BGS Arc, BLR 560001',
  };

  const dropoffData = {
    name: 'Ganesha Temple, BLR 560001',
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.riderInfo}>
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
            </View>
            <View style={styles.ratingContainer}>
              <View style={styles.ratingRow}>
                <MaterialIcons name="star" size={16} color="#FFD700" />
                <Text style={styles.ratingText}>{riderData.rating}</Text>
              </View>
              <Text style={styles.timeText}>22 min</Text>
            </View>
          </View>

          <View style={styles.locationInfo}>
            <View style={styles.locationItem}>
              <MaterialIcons name="location-on" size={24} color="#FFA500" />
              <Text style={styles.locationText} numberOfLines={2}>{pickupData.name}</Text>
            </View>
            <View style={styles.locationDivider} />
            <View style={styles.locationItem}>
              <MaterialIcons name="location-on" size={24} color="#4169E1" />
              <Text style={styles.locationText} numberOfLines={2}>{dropoffData.name}</Text>
            </View>
          </View>

          <View style={styles.priceContainer}>
            <View style={styles.priceRow}>
              <Text style={styles.priceText}>$25.00</Text>
              <Text style={styles.timeEstimate}>2.5 km</Text>
            </View>
            <TouchableOpacity 
              style={styles.viewBillButton}
              onPress={() => setBillModalVisible(true)}
            >
              <MaterialIcons name="receipt-long" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.cancelButton}>
              <MaterialIcons name="close" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.callButton}>
              <MaterialIcons name="phone" size={24} color="white" />
            </TouchableOpacity>
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
  },
  scrollContainer: {
    flex: 1,
  },
  riderInfo: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    padding: 16,
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