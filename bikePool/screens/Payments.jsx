import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';

export default function Payments() {
  const router = useRouter();
  const { name, charge } = useLocalSearchParams();

  const handlePayCash = () => {
    router.replace(`/(routes)/rating?name=${name}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment</Text>
      <Text style={styles.message}>
      "Rs. {charge} for {name} – because every great ride deserves a grand finish!"
      </Text>
      <TouchableOpacity style={styles.payButton} onPress={handlePayCash}>
        <Text style={styles.payButtonText}>I've Paid Cash 💸</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E', // Deep dark blue background
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    color: '#FFD700', // Gold color for a bold title
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
    marginBottom: 20,
    textTransform: 'uppercase',
  },
  message: {
    fontSize: 20,
    color: '#FFFFFF',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 20,
    lineHeight: 28,
    paddingHorizontal: 15,
  },
  payButton: {
    backgroundColor: '#FF4500', // Bright orange for a bold, striking button
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    elevation: 10,
    shadowColor: '#FF6347', // Light red shadow for a glow effect
    shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    marginTop: 20,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
