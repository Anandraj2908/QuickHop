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

const BillModal = ({ visible, onClose }) => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.receiptHeader}>
            <Text style={styles.receiptTitle}>BikePool Receipt</Text>
            <TouchableOpacity 
              style={styles.downloadIcon} 
              onPress={() => Alert.alert('Receipt Download', 'Starting download...')}
            >
              <MaterialIcons name="file-download" size={24} color="#4A90E2" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <MaterialIcons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.receiptContent} showsVerticalScrollIndicator={false}>
            <View style={styles.customerSection}>
              <View>
                <Text style={styles.customerName}>Anand, thanks</Text>
                <Text style={styles.forUsing}>for using</Text>
                <Text style={styles.uberText}>BikePool</Text>
              </View>
              <Text style={styles.receiptDate}>05.06.2024</Text>
            </View>
  
            <View style={styles.totalSection}>
              <Text style={styles.totalText}>Total</Text>
              <Text style={styles.totalAmount}>Rs.13.40</Text>
              <Text style={styles.basePrice}>Base price Rs.13.40</Text>
              <Text style={styles.tipsText}>Tips Rs. 1.00</Text>
            </View>
  
            <View style={styles.tearLine} />
  
            <View style={styles.detailsSection}>
              <Text style={styles.detailsTitle}>Details</Text>
              <View style={styles.timeLocationContainer}>
                <View style={styles.timeLocationRow}>
                  <MaterialIcons name="access-time" size={20} color="#666" />
                  <Text style={styles.timeText}>10:25 am</Text>
                </View>
                <Text style={styles.locationText} numberOfLines={2}>yahan</Text>
              </View>
              
              <View style={styles.timeLocationContainer}>
                <View style={styles.timeLocationRow}>
                  <MaterialIcons name="access-time" size={20} color="#666" />
                  <Text style={styles.timeText}>10:45 am</Text>
                </View>
                <Text style={styles.locationText} numberOfLines={2}>wahan</Text>
              </View>
            </View>
  
            
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
      },
      modalContent: {
        backgroundColor: 'white',
        width: '90%',
        maxHeight: '80%',
        borderRadius: 12,
        overflow: 'hidden',
      },
      receiptHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#000',
      },
      receiptTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
      },
      closeButton: {
        padding: 8,
        backgroundColor: '#fff',
        borderRadius: 20,
      },
      receiptContent: {
        padding: 20,
      },
      customerSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
      },
      customerName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
      },
      forUsing: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
      },
      uberText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
      },
      receiptDate: {
        color: '#666',
      },
      totalSection: {
        marginBottom: 24,
      },
      totalText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 8,
      },
      totalAmount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 8,
      },
      basePrice: {
        color: '#666',
        marginBottom: 4,
      },
      tipsText: {
        color: '#666',
      },
      tearLine: {
        height: 1,
        backgroundColor: '#E0E0E0',
        marginVertical: 24,
        borderStyle: 'dashed',
      },
      detailsSection: {
        marginBottom: 24,
      },
      detailsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 16,
      },
      timeLocationContainer: {
        marginVertical: 8,
      },
      timeLocationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
      },
      mapContainer: {
        height: 100,
        backgroundColor: '#f5f5f5',
        marginVertical: 16,
        borderRadius: 8,
        overflow: 'hidden',
        position: 'relative',
      },
      mapLine: {
        position: 'absolute',
        top: '50%',
        left: 20,
        right: 20,
        height: 2,
        backgroundColor: '#4A90E2',
      },
      driverSection: {
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        paddingTop: 16,
      },
      driverInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      driverImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
      },
      driverName: {
        fontWeight: '500',
        marginBottom: 4,
      },
      carInfo: {
        color: '#666',
      },
      rateDenisButton: {
        backgroundColor: '#4A90E2',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
      },
      rateDenisText: {
        color: '#fff',
        fontWeight: '500',
      },
      downloadIcon: {
        position: 'absolute',
        top: 16,
        right: 80,
        width: 40,
        height: 40,
        backgroundColor: '#fff',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
      },
});

export default BillModal;