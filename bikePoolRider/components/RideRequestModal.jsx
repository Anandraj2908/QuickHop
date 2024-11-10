import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const RideRequestModal = ({
  isVisible,
  currentLocationName,
  destinationLocationName,
  distance,
  rideCharge,
  onAccept,
  onCancel
}) => {
  if (!isVisible) return null;

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={isVisible}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <LinearGradient
            colors={['#3b82f6', '#2563eb']}
            style={styles.header}
          >
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>New Ride Request</Text>
              <View style={styles.timeContainer}>
                <Ionicons name="time-outline" size={16} color="white" />
                <Text style={styles.timeText}>Just now</Text>
              </View>
            </View>
          </LinearGradient>

          {/* Content */}
          <View style={styles.content}>
            {/* Location Section */}
            <View style={styles.locationContainer}>
              {/* From Location */}
              <View style={styles.locationItem}>
                <View style={styles.iconContainer}>
                  <Ionicons name="location" size={24} color="#3b82f6" />
                </View>
                <View style={styles.locationTextContainer}>
                  <Text style={styles.locationLabel}>From</Text>
                  <Text style={styles.locationText}>{currentLocationName}</Text>
                </View>
              </View>

              {/* Vertical Line */}
              <View style={styles.verticalLine} />

              {/* To Location */}
              <View style={styles.locationItem}>
                <View style={styles.iconContainer}>
                  <Ionicons name="location" size={24} color="#ef4444" />
                </View>
                <View style={styles.locationTextContainer}>
                  <Text style={styles.locationLabel}>To</Text>
                  <Text style={styles.locationText}>{destinationLocationName}</Text>
                </View>
              </View>
            </View>

            {/* Ride Details */}
            <View style={styles.detailsContainer}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Distance</Text>
                <Text style={styles.detailValue}>{distance} km</Text>
              </View>
              <View style={[styles.detailItem, styles.fareContainer]}>
                <Text style={styles.detailLabel}>Estimated Fare</Text>
                <Text style={styles.fareValue}>₹ {rideCharge}</Text>
              </View>
            </View>

            {/* Buttons */}
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={[styles.button, styles.declineButton]}
                onPress={onCancel}
              >
                <Text style={styles.declineButtonText}>Decline</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.acceptButton]}
                onPress={onAccept}
              >
                <Text style={styles.acceptButtonText}>Accept Ride</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width - 32,
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    marginLeft: 4,
    fontSize: 14,
    color: 'white',
  },
  content: {
    padding: 20,
  },
  locationContainer: {
    marginBottom: 24,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 8,
  },
  iconContainer: {
    width: 32,
    alignItems: 'center',
  },
  locationTextContainer: {
    flex: 1,
    marginLeft: 8,
  },
  locationLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
  },
  verticalLine: {
    width: 2,
    height: 20,
    backgroundColor: '#e5e7eb',
    marginLeft: 15,
  },
  detailsContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fareContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  detailLabel: {
    fontSize: 15,
    color: '#6b7280',
  },
  detailValue: {
    fontSize: 15,
    color: '#1f2937',
    fontWeight: '600',
  },
  fareValue: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '700',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  declineButton: {
    backgroundColor: '#f3f4f6',
  },
  acceptButton: {
    backgroundColor: '#3b82f6',
  },
  declineButtonText: {
    color: '#4b5563',
    fontSize: 16,
    fontWeight: '600',
  },
  acceptButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RideRequestModal;